const md5 = require("md5")
const MessageAction = require('./messageAction')

function gdf_encode(object) {
    sender = object.hasOwnProperty('sender') ? object['sender'] : "Anon"
    action = object.hasOwnProperty('action') ? object['action'] : MessageAction.REQUEST
    message = object.hasOwnProperty('message') ? object['message'] : ""
    messageType = object.hasOwnProperty('messageType') ? object['messageType'] : "TEXT"
    recipient = object.hasOwnProperty('recipient') ? object['recipient'] : "Anon"
    recipientType = object.hasOwnProperty('recipientType') ? object['recipientType'] : "USER"
    let uid = md5(sender.concat(action, message, messageType, recipient, recipientType));
    let gdf = uid.concat("|", sender, "|", action, "|", message, "|", messageType,"|", recipient, "|", recipientType);
    return gdf;
}

function gdf_decode(gdf_msg) {
    let msg = new Object();
    msg_arr = gdf_msg.split("|")
    msg.uid = msg_arr[0]
    msg.sender = msg_arr[1]
    msg.action = msg_arr[2]
    msg.message = msg_arr[3]
    msg.messageType = msg_arr[4]
    msg.recipient = msg_arr[5]
    msg.recipientType = msg_arr[6]
    return msg;
}

module.exports = {
    gdf_decode: gdf_decode,
    gdf_encode: gdf_encode
}