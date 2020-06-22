const md5 = require("md5")

module.exports = function(sequelize, DataTypes) {
    ChatRecord = sequelize.define("ChatRecord", {
      sender: DataTypes.STRING,
      message: DataTypes.STRING,
      recipient: DataTypes.STRING,
      classifier:DataTypes.STRING
    },{
      getterMethods: {
        uid: function() {return md5(this.sender + this.message + this.recipient)},
        s_classifier: function() {return "USER"},
        m_classifier: function() {return this.classifier},
        r_classifier: function() {return "USER"}
      }
    })
    return ChatRecord
  }