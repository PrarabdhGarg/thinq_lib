const md5 = require('md5')

module.exports = function(sequelize, DataTypes) {
    PendingRequest = sequelize.define("PendingRequest", {
      sender: DataTypes.STRING,
      priority: DataTypes.DOUBLE,
      status: DataTypes.STRING, //currently not used
    })
    return PendingRequest
}