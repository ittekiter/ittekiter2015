# -*- coding: utf-8 -*-
class SessionsController < ApplicationController
  protect_from_forgery except: :make_suggestion

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
    vresult = Array.new
    nresult = yp.parse(sentence,{results: 'uniq',uniq_response:'baseform',filter:'9'},:POST)
    vresult = yp.parse(sentence,{results: 'uniq',uniq_response:'baseform',filter:'10'},:POST)
    noun = ""
    verb = ""
    if nresult["ResultSet"]["uniq_result"]["word_list"] != nil then
      if nresult["ResultSet"]["uniq_result"]["filtered_count"] == "1" then
        noun = nresult["ResultSet"]["uniq_result"]["word_list"]["word"]["baseform"]
      else
        max = nresult["ResultSet"]["uniq_result"]["word_list"]["word"][0]["count"].to_i   
        nresult["ResultSet"]["uniq_result"]["word_list"]["word"].each do |word|
          if max <= word["count"].to_i then  
            noun = word["baseform"]
          end
        end
      end
    end
    if vresult["ResultSet"]["uniq_result"]["word_list"] != nil then
      if vresult["ResultSet"]["uniq_result"]["filtered_count"] == "1" then
        verb = vresult["ResultSet"]["uniq_result"]["word_list"]["word"]["baseform"]
      else
        max = vresult["ResultSet"]["uniq_result"]["word_list"]["word"][0]["count"].to_i
        vresult["ResultSet"]["uniq_result"]["word_list"]["word"].each do |word|
          if max <= word["count"].to_i then  
            verb = word["baseform"]
          end
        end
      end
    end
    res_text = noun + verb
    render text: res_text
  end

end
