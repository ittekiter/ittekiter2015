# -*- coding: utf-8 -*-
class SessionsController < ApplicationController
  def callback
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"],auth["uid"]) || User.create_with_omniauth(auth)
<<<<<<< HEAD

    test = Twitter::REST::Client.new do |config|
      config.consumer_key        = "teo4El7z2U10XsJIGjRiH0ncc"
      config.consumer_secret     = "SGTvNiDG1ghPm9w0uQIx2fUa7E2oXxUyBcCQBNLBDgg23heDvN"
      config.access_token        = user.access_token
      config.access_token_secret = user.access_token_secret
=begin
      :oauth_token => user.access_token,
      :oauth_token_secret =>  user.access_token_secret
=end      
      end
    #text = sprintf("yahoooooo!",Time.now)
    #test.update("yahiii!")
=======
>>>>>>> afffdd9fd8f4bdcc9547e04115edf4bc4d10eb85
    session[:user_id] = user.id
    session[:uid] = user.uid
    redirect_to root_url
  end
  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end
