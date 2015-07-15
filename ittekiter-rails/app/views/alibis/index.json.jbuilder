json.array!(@alibis) do |alibi|
  json.extract! alibi, :id, :dep, :des, :dep_date, :dep_time, :route_object, :user_id
  json.url alibi_url(alibi, format: :json)
end
