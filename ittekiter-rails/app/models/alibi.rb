class Alibi < ActiveRecord::Base
 #get_alibi = params[:alibi]
 def self.create_with_get(auth)
    create! do |alibi|
     alibi.dep = "test"#@get_alibi.origin
     alibi.des = "test"#@get_alibi.destination
     alibi.dep_time = "test"#@get_alibi.dep_time
     alibi.route_object = "test"#@get_alibi.route_object
     alibi.user_id = "test"#current_user.name
   end
 end
end
