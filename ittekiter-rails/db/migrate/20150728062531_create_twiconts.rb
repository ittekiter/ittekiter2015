class CreateTwiconts < ActiveRecord::Migration
  def change
    create_table :twiconts do |t|
      t.datetime :twidt
      t.string :twict
      t.string :twiloc
      t.integer :alibi_id
      t.string :user_id

      t.timestamps null: false
    end
  end
end
