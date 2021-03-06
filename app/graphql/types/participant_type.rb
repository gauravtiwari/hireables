ParticipantType = GraphQL::ObjectType.define do
  name 'Participant'
  description 'Fetch conversation participant associated fields'
  interfaces [GraphQL::Relay::Node.interface]
  global_id_field :id

  field :name, types.String, 'Participant name'
  field :avatar_url, types.String, 'Participant avatar'
  field :login, types.String, 'Participant username'
  field :bio, types.String, 'The bio of this employer'
  field :company, types.String, 'The company of this employer'
  field :location, types.String, 'The location of this employer'

  field :database_id, types.Int, 'Participant database id' do
    resolve ->(obj, _args, _ctx) { obj.id }
  end

  field :type, types.String, 'Participant type' do
    resolve ->(obj, _args, _ctx) { obj.class.name.downcase }
  end
end
