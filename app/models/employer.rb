class Employer < ApplicationRecord
  include Redis::Objects

  devise :database_authenticatable, :registerable, :recoverable,
         :rememberable, :trackable, :validatable

  store_accessor :preferences, :languages, :location, :type, :industries

  validates_presence_of :name, :company, :website, :login, :preferences
  validates_uniqueness_of :login
  validate :website_url_format, unless: :url_valid?

  before_validation :add_login, unless: :login_present?
  after_commit :notify_admin!, on: :create

  has_many :favourites, dependent: :destroy
  has_many :searches, dependent: :destroy
  set :favourited_developers

  mount_uploader :avatar, ImageUploader

  acts_as_messageable

  def active_for_authentication?
    super && verified?
  end

  def inactive_message
    if !verified?
      :not_verified
    else
      super
    end
  end

  def favourited?(developer)
    favourited_developers.member?(developer.login)
  end

  def add_to_favourites!(developer)
    if developer.respond_to?(:premium)
      favourites.create!(login: developer.login, developer_id: developer.id)
    else
      favourites.create!(login: developer.login)
    end
  end

  def remove_from_favourites(login)
    favourites.find_by!(login: login).destroy
  end

  private

  def login_present?
    login.present?
  end

  def add_login
    self.login = available_login
  end

  def available_login
    login_username = name.parameterize

    if Employer.find_by_login(name.parameterize).blank?
      login_username
    else
      generate_login
    end
  end

  def generate_login
    num = 1
    login_username = name.parameterize
    while Employer.find_by_login(login_username).present?
      login_username = "#{name.parameterize}#{num}"
      num += 1
    end
    login_username
  end

  def notify_admin!
    return unless Rails.env.production?
    AdminMailerJob.enqueue(self.class.name, id)
  end

  def website_url_format
    errors.add(:website, ' must be a valid URL')
  end

  def url_valid?
    url = begin
            URI.parse(website)
          rescue
            false
          end
    url.is_a?(URI::HTTP) || url.is_a?(URI::HTTPS)
  end
end
