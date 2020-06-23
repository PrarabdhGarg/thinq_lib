const md5 = require('md5')

module.exports = function(sequelize, DataTypes) {
    global.ServiceRequest = sequelize.define("ServiceRequest", {
      sender: DataTypes.STRING,
      status: DataTypes.STRING, //{"sent":Sent Request,"pending":Pending Request,"created":Consumer creates request,"sp_ack":Sp acknowledges,"c_ack":consumer acknowledges}
      display:DataTypes.STRING,
      priority: DataTypes.DOUBLE
    })
    return ServiceRequest
}