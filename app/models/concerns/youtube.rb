module Youtube
  extend ActiveSupport::Concern

  included do
    YOUTUBE_CHANNEL_URI = 'https://www.googleapis.com/youtube/v3/channels'.freeze
    YOUTUBE_PLAYLIST_URI = 'https://www.googleapis.com/youtube/v3/playlistItems'.freeze
    YOUTUBE_VIDEO_URI = 'https://www.googleapis.com/youtube/v3/videos'.freeze
  end

  def fetch_talks
    videos, agent = fetch_videos
    videos.map do |video|
      video_hash = video.to_attrs.except(:snippet, :statistics)
      video_hash.merge!(video[:snippet]).merge!(video[:statistics])
      Sawyer::Resource.new(agent, video_hash)
    end
  end

  private

  def fetch_videos
    query_params = youtube_query_params <<
                   "&id=#{playlist_ids}" << '&part=snippet,statistics'
    agent = initialize_agent("#{YOUTUBE_VIDEO_URI}?#{query_params}")
    root = agent.start
    videos = root.data.items
    [videos, agent]
  end

  def playlist_ids
    query_params = youtube_query_params << "&playlistId=#{upload_playlist}"
    agent = initialize_agent("#{YOUTUBE_PLAYLIST_URI}?#{query_params}")
    root = agent.start

    return [] if root.data.items.nil?
    root.data.items.map do |item|
      item.contentDetails.videoId
    end.join(',')
  end

  def upload_playlist
    query_params = youtube_query_params << '&mine=true'
    agent = initialize_agent("#{YOUTUBE_CHANNEL_URI}?#{query_params}")
    root = agent.start

    root.data.items.first.contentDetails.relatedPlaylists.uploads
  end

  def youtube_query_params
    {
      access_token: access_token,
      part: 'contentDetails',
      maxResults: 11
    }.to_query
  end
end