class TwicontsController < ApplicationController
	protect_from_forgery except: :add_tweet

	def add_tweet
		@twicont = Twicont.create(twidt: params[:tim],twict: params[:text], twiloc: params[:location], user_id: current_user.uid,alibi_id:params[:ali])
		render nothing: true
	end

    def delete_alibi
    	Twicont.delete_all(["_id = ?",params[:id]])
    	render nothig: true
    end

	def get_tweet
		@tweet = Twicont.where(alibi_id: params[:alibi_id])
		render json: @tweet
	end

	def update_tweet
		Twicont.update(params[:id], twidt: params[:tim], twict: params[:text])
		render nothing: true		
	end
	
end
