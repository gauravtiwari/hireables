class Developer < ApplicationRecord
  devise :database_authenticatable, :trackable,
         :validatable, :omniauthable, :rememberable

  store_accessor :data, :html_url, :company, :blog, :followers,
                 :public_gists, :public_repos

  validates_presence_of :name, :login
  validates_uniqueness_of :login

  has_many :connections, dependent: :destroy
  has_many :achievements, -> { where(pinned: true) }, class_name: 'Import'

  before_save :format_platforms, unless: :empty_platforms?
  after_create :seed_available_connections
  after_commit :set_premium!, on: :update, if: :profile_completed?
  after_commit :fetch_languages!, on: :create
  after_commit :cache_orgs!, on: :create
  after_commit :notify_admin!, on: :create

  mount_uploader :avatar, ImageUploader

  def profile_completed?
    required_fields.all? do |field|
      field = public_send(field)
      field.present? && !field.empty?
    end && !premium?
  end

  def access_token_by_provider(provider)
    connection_by_provider(provider).try(:access_token)
  end

  def connection_by_provider(provider)
    connections.where(provider: provider).first
  end

  def github_access_token
    @github_access_token ||= access_token_by_provider('github')
  end

  private

  def seed_available_connections
    allowed_connections.each do |connection|
      connections.create!(provider: connection)
    end
  end

  def notify_admin!
    return unless Rails.env.production?
    AdminMailerWorker.enqueue(self.class.name, id)
  end

  def empty_platforms?
    platforms.nil? || platforms.empty?
  end

  def format_platforms
    self.platforms = platforms.join(',').split(',')
  end

  def required_fields
    %w(bio email platforms location)
  end

  def fetch_languages!
    FetchDeveloperLanguagesWorker.enqueue(login, github_access_token)
  end

  def cache_orgs!
    FetchDeveloperOrgsWorker.enqueue(login, github_access_token)
  end

  def set_premium!
    update!(premium: profile_completed?)
  end

  def allowed_connections
    %w(stackoverflow linkedin youtube)
  end
end
