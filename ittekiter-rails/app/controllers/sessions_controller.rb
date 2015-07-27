# -*- coding: utf-8 -*-
class SessionsController < ApplicationController
  def callback
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"],auth["uid"]) || User.create_with_omniauth(auth)
    session[:user_id] = user.id
    session[:uid] = user.uid
    redirect_to root_url
  end
  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end
  def make_suggestion
    sentence = params[:content]
    require 'yahoo_parse_api'
    YahooParseApi::Config.app_id = "dj0zaiZpPTd5UGIzNXZHNkxROCZzPWNvbnN1bWVyc2VjcmV0Jng9MmU-"
    yp = YahooParseApi::Parse.new
    nresult = Array.new
    mresult = Array.new
    nresult = yp.parse(sentence,{results: 'uniq',responses:'baseform',filter:'9'},:POST)
    mresult = yp.parse(sentence,{results: 'uniq',responses:'baseform',filter:'1'},:POST)
    noun = ""
    mod = ""
    max = nresult["ResultSet"]["uniq_result"]["word_list"]["word"][0]["count"].to_i   
    nresult["ResultSet"]["uniq_result"]["word_list"]["word"].each do |word|
      if max <= word["count"].to_i then  
        noun = word["surface"]
      end
    end
    max = mresult["ResultSet"]["uniq_result"]["word_list"]["word"][0]["count"].to_i
    mresult["ResultSet"]["uniq_result"]["word_list"]["word"].each do |word|
      if max <= word["count"].to_i then  
        mod = word["surface"]
      end
    end
    res_text = noun + "が" + mod
    render text: res_text
  end

end
