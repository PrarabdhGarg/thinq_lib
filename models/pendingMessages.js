// This model is used to queue messages to users who were offline at the time message was being sent

module.exports = function(sequelize, DataTypes) {
    global.PendingMessages = sequelize.define("PendingMessages", {
        uid: DataTypes.INTEGER,
        sender: DataTypes.STRING,
        action: DataTypes.INTEGER, // Currently, this would be 1 for requests and 2 for updates
        message: DataTypes.STRING,
        messageType: DataTypes.STRING,
        reciver: DataTypes.STRING,
        reciverType: DataTypes.STRING,
    })
    return PendingMessages
}