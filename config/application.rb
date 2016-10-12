$LOAD_PATH << File.expand_path('../lib', __dir__)
require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
# require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
require 'schema_reloader'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Hireables
  class Application < Rails::Application
    # Autloaded paths
    config.autoload_paths += Dir["#{config.root}/app/graphql/*"]
    config.autoload_paths += Dir["#{config.root}/app/lib/*"]
    config.autoload_paths << Rails.root.join('app/services')

    # Middlewares
    config.middleware.use SchemaReloader

    # Autoload lib
    config.autoload_paths += Dir["#{config.root}/app/lib/*"]

    # Configure rails g to skip helper/assets files
    config.generators do |g|
      g.assets = false
      g.helper = false
      g.view_specs      false
      g.helper_specs    false
    end

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'fonts.gstatic.com'
        resource '*', headers: :any, methods: [:get, :options]
      end
    end

    # Don't silence errors
    config.active_record.raise_in_transactional_callbacks = true
    ActiveSupport.halt_callback_chains_on_return_false = false

    # Setup sidekiq
    config.active_job.queue_adapter = :sidekiq
  end
end
