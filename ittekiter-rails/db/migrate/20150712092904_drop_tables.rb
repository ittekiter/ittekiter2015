class DropTables < ActiveRecord::Migration
  def change
    drop_table :twicontents
  end
end
