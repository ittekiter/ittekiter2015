class TwicontsController < ApplicationController
	#一通り必要そうなメソッド書いといた
	#パラメータのIDの名前とか必要に応じて変えちゃってください
	def add_tweet
		#jsからツイート内容、日時、場所が送られてくる
		#てぃば氏曰く場所の情報も欲しいらしいのでモデルの改変をしました
		Twicont.create(twidt: params[:tweet_date],twict: params[:twicont], twiloc: params[:twiloc], name: current_user.name)
		render nothing: true
	end

    def delete_tweet
		Twicont.delete(["id = ?",params[:id]])
		render nothing: true
	end

	def update_tweet
		Twicont.where(["id = ?",params[:id]]).update(twidt: params[:tweet_date], twict: params[:twicont])
		render nothing: true		
	end
end
