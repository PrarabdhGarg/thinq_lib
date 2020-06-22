module.exports = function(sequelize, DataTypes) {
    FileBook = sequelize.define("FileBook", {
      ipfs_hash: DataTypes.STRING,
      name:DataTypes.STRING,
    },{
      getterMethods: {
        h_classifier: function() {return "FileHash"},
        n_classifier: function() {return "Name"} }
      }
    )
    return FileBook
  }