require 'twitter'
class User < ActiveRecord::Base
	def self.create_with_omniauth(auth)
		create! do |user|
			user.provider = auth["provider"]
			user.uid = auth["uid"]
			user.name = auth["info"]["name"]
			user.screen_name = auth["info"]["nickname"]
			user.access_token = auth["credentials"]["token"]
			user.access_token_secret = auth["credentials"]["secret"]
		end
	end
=begin
	def self.tweet(auth)
		text = sprintf("yahoooooo!",Time.now)
		twitter_client(auth).update(text)
	end	
=end
end