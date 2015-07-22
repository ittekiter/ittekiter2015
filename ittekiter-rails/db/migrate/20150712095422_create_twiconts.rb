class CreateTwiconts < ActiveRecord::Migration
  def change
    create_table :twiconts do |t|
      t.datetime :twidt
      t.string :twict
      t.string :name

      t.timestamps null: false
    end
  end
end
