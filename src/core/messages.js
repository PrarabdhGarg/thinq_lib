const cryptography = require('../util/cryptography')
const gdf = require('../util/gdf')

const MessageAction = {
    REQUEST: 1,
    UPDATE: 2,
    DELETE: 3,
    C_CREATE:4,
    SP_ACK:5,
    C_ACK:6,
    SP_C_CREATE:7,
    RATE_UPDATE:8
}

function broadcastMessageToRoom(message, args) {
    message['recipient'] = 'All'
    args.room.broadcast(gdf.gdf_encode(message))
}

async function broadcastMessageToAddressBook(message, args) {
    args.db.User.findAll().then((users) => {
        for(let i = 0; i < users.length; i++) {
            if(users[i].dataValues.ipfs != message.sender) {
                message.reciverType = "USER"
                message.reciver = users[i].dataValues.ipfs
                if(args.room.hasPeer(users[i].dataValues.ipfs))
                    sendMessageToUser(message, users[i].dataValues.ipfs)
                else
                    args.db.PendingMessages.create(message)
            }
        }
    })
}

async function sendMessageToUser(msg, user, args) {
    message = gdf.gdf_encode(msg)
    pkHash = (await args.db.User.findOne({where: {ipfs: user}})).dataValues.publicKey
    args.node.get(pkHash).then(([file]) => {
        cryptography.getEncryptedText(message, file.content.toString()).then((msg) => {
            args.room.sendTo(user, msg)
        })
    })
}

module.exports = {
    broadcastMessageToRoom: broadcastMessageToRoom,
    sendMessageToUser: sendMessageToUser,
    broadcastMessageToAddressBook: broadcastMessageToAddressBook,
    messageAction: MessageAction
}