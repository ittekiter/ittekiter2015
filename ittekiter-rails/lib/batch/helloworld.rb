require "twitter"





class Batch::Helloworld
  def self.helloworld
  user_id = "non2ono"    
    client = Twitter::REST::Client.new do |config|
    config.consumer_key        = "teo4El7z2U10XsJIGjRiH0ncc"
    config.consumer_secret     = "SGTvNiDG1ghPm9w0uQIx2fUa7E2oXxUyBcCQBNLBDgg23heDvN"
    config.access_token        = "3196022940-o1xoO0WOacsaRfXpqO2z948p7sjlNIQkKlUK50e"
    config.access_token_secret = "g2m4nLSpVO5KAjLG077iWZ9D77F1F7i4mzbp9cXnWhfXK"
    end
    puts "HelloWorld!"
    client.update("Hello Hello Hello ds")
    client.update("Hello Hello Hello")
    client.update("Hello Hello Hello")
  end
end