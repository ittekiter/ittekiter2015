# -*- coding: utf-8 -*-
class SessionsController < ApplicationController
  def callback
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"],auth["uid"]) || User.create_with_omniauth(auth)

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
    session[:user_id] = user.id
    redirect_to root_url
  end
  def add
    auth = request.env["omniauth.auth"]
    alibi = Alibi.create_with_get(auth)
    redirect_to root_url
  end
  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end
