const cryptography = require('../util/cryptography')
const gdf = require('../util/gdf')
const MessageAction = require ('./messageAction')

const RequestStatus = {
    sent:1,
    pending:2,
    created:3,
    sp_ack:4,
    c_ack:5
}

function broadcastMessageToRoom(message, args) {
    message['recipient'] = 'All'
    args.room.broadcast(gdf.gdf_encode(message))
}

async function broadcastMessageToAddressBook(message, args) {
    users = await args.db.User.findAll()
    for(let i = 0; i < users.length; i++) {
        if(users[i].dataValues.ipfs != message.sender) {
            message.reciverType = "USER"
            message.reciver = users[i].dataValues.ipfs
            sendMessageToUser(message, users[i].dataValues.ipfs)
        }
    }
}

async function sendMessageToUser(msg, user, args) {
    message = gdf.gdf_encode(msg)
    pkHash = (await args.db.User.findOne({where: {ipfs: user}})).dataValues.publicKey
    let [file] = await args.node.get(pkHash)
    msg = await cryptography.getEncryptedText(message, file.content.toString())
    if(args.room.hasPeer(user))
        args.room.sendTo(user, msg)
    else
        args.db.PendingMessages.create(msg)
}

async function onMessageRecived(args, message, callback) {
    let decrypted_msg = await cryptography.getDecryptedText(message.data.toString())
    let decoded_msg = await gdf.gdf_decode(decrypted_msg)

    if(decoded_msg.action == MessageAction.UPDATE) {
        user_info = await args.db.User.findOne({where : {ipfs:message.from}})
        if(user_info==null)
            return
                
        [file] = await args.node.get(decoded_msg.message)
        data = JSON.parse(file.content.toString())

        let update = new Object()
        update['filehash'] = decoded_msg.message
        if(decoded_msg.messageType == 'Bio')
            update['bio'] = data.bio
        else if(decoded_msg.messageType == 'PublicKey')
            update['publicKey'] = data.PublicKey
        else if(decoded_msg.messageType == 'Type')
            update['type'] = data.type

        res = await args.db.User.update(update , {where: {ipfs:message.from}})
        console.log("DataBase Updated Sucessfully")
    } else if(decoded_msg.action == MessageAction.REQUEST) {
        user = await args.db.User.findOne({where: {
            ipfs: message.from
        }})
        let rating = 0
        console.log('Rating = ' + JSON.stringify(user))
        try {
            rating = parseFloat(user.dataValues.rating)
        } catch(e) {
            rating = 0
        }
        console.log('Rating = ' + rating.toString())
        args.db.ServiceRequest.create({sender: message.from , status:RequestStatus.pending , rating: rating})
    } else if(decoded_msg.action == MessageAction.DELETE) {
        args.db.ServiceRequest.destroy({where : {sender: message.from,status:RequestStatus.pending}})
    } else if(decoded_msg.action == MessageAction.C_CREATE) {
        args.db.ServiceRequest.destroy({where : {sender: message.from,status:RequestStatus.pending}})
        args.db.ServiceRequest.create({sender:message.from,status:RequestStatus.created,display:"2"})
    } else if(decoded_msg.action == MessageAction.SP_ACK) {
        args.db.ServiceRequest.update({status:RequestStatus.sp_ack,display:"2"},{where: {sender:message.from , status: RequestStatus.created}})
        info = await args.node.id()
        console.log("server SP_ack infoid is written here:",info.id.toString())
        documentPath='/ratings/' + info.id.toString() + '.txt'
        console.log('The rating in spack is written here:',decoded_msg.rating.toString())
        await args.node.files.write(documentPath, Buffer.from(info.id.toString()+'|'+decoded_msg.rating+'|'+decoded_msg.transact), {
            create: true,
            parents: true
            })
            respon = await args.node.files.stat(documentPath)
            console.log('Stat Result = ' + JSON.stringify(respon))
            hash = respon.hash
            console.log('File Hash = ' + hash)
            result = await args.db.User.update({ratinghash:hash,rating:decoded_msg.rating},{where: {ipfs:info.id}})
            console.log("results of filehash is :",result)
        broadcastMessageToAddressBook({
            sender: info.id,
            messageAction:MessageAction.RATE_UPDATE,
            rating:decoded_msg.rating,
            transact:decoded_msg.transact
        })  
    } else if(decoded_msg.action == MessageAction.C_ACK) {
        args.db.ServiceRequest.update({status:RequestStatus.c_ack},{where: {sender:message.from , status: RequestStatus.sp_ack}})
        info = await args.node.id()
        console.log("server C_ack infoid is:",info.id.toString())
        documentPath='/ratings/' + info.id.toString() + '.txt'
        console.log('The rating in cack is written here:',decoded_msg.rating.toString())
        await args.node.files.write(documentPath, Buffer.from(info.id.toString()+'|'+decoded_msg.rating+'|'+decoded_msg.transact), {
            create: true,
            parents: true
            })
        respon = await args.node.files.stat(documentPath)
        console.log('Stat Result = ' + JSON.stringify(respon))
        hash = respon.hash
        console.log('File Hash = ' + hash)
        result = await args.db.User.update({ratinghash:hash,rating:decoded_msg.rating},{where: {ipfs:info.id}})
        console.log("results of filehash is :",result)
                    
        broadcastMessageToAddressBook({
            sender: info.id,
            messageAction:MessageAction.RATE_UPDATE,
            rating:decoded_msg.rating,
            transact:decoded_msg.transact
        })
     
    } else if(decoded_msg.action == MessageAction.SP_C_CREATE) {
        args.db.ServiceRequest.destroy({where : {sender: message.from,status:RequestStatus.sent}})
        args.db.ServiceRequest.create({sender:message.from,status:RequestStatus.created,display:"1"})
    } else if(decoded_msg.action == MessageAction.RATE_UPDATE) {
        documentPath='/ratings/' + message.from.toString() + '.txt'
        console.log("------------------------server rateupdate id is:",message.from.toString())
        console.log("server rate_update documentpath is:",documentPath)
        console.log('The rating in rate_update is written here:',decoded_msg.rating.toString())
        await args.node.files.write(documentPath, Buffer.from(message.from.toString()+'|'+decoded_msg.rating+'|'+decoded_msg.transact), {
            create: true,
            parents: true
            })
        respon = await args.node.files.stat(documentPath)
        console.log('Stat Result = ' + JSON.stringify(respon))
        hash = respon.hash
        console.log('File Hash = ' + hash)
        result = await args.db.User.update({ratinghash:hash,rating:decoded_msg.rating.toString()},{where: {ipfs:message.from}})
        console.log("results of filehash is :",result)
    }
    if(callback != null) {
        callback(decoded_msg)
    }
}

module.exports = {
    broadcastMessageToRoom: broadcastMessageToRoom,
    sendMessageToUser: sendMessageToUser,
    broadcastMessageToAddressBook: broadcastMessageToAddressBook,
    onMessageRecived: onMessageRecived,
    RequestStatus:RequestStatus,
    MessageAction: MessageAction
}