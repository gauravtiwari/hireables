class PrepareSearchParams
  attr_reader :params, :current_recruiter, :request

  def initialize(params, current_recruiter, request)
    @params = params
    @request = request
    @current_recruiter = current_recruiter
    cache_query
  end

  def to_query
    request_params.map do |param, value|
      "#{param}:#{value.gsub(/\s+/, '+')}" if supported?(param, value)
    end.compact.join(' ')
  end

  def valid?
    valid_params.any?
  end

  def valid_params
    params.to_h.select do |param, value|
      supported?(param, value)
    end
  end

  private

  def request_params
    valid? ? valid_params : current_recruiter.preferences
  end

  def cache_query
    cache_key = "search/recruiter/#{current_recruiter.id}"
    Rails.cache.write(cache_key, query: to_query,
                                 page: Integer(params['page'] || 1),
                                 search: valid?,
                                 params: params)
  end

  def supported?(key, value)
    supported.include?(key.to_s) && value.present?
  end

  def supported
    %w(language location repos)
  end
end
