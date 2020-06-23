const message = require('./messages')



// Returns a list of all the sent requests
async function sentRequests(args){
    args.db.ServiceRequest.findAll({where: {status: "sent"}}).then((requests)=>{
        let promises = []
        for(request of requests)
            promises.push(args.db.User.findOne({where: {ipfs:request.dataValues.sender}}))

        Promise.all(promises).then((users)=>{
            for(let i=0 ; i<requests.length ; i++)
                requests[i].dataValues.sender = users[i].dataValues.name
                
            return {requestType: "Sent" , requests:requests}
        })
    })
}

// Returns a list of all the pending requests sorted by priority
async function pendingRequests(args){
    args.db.ServiceRequest.findAll({where: {status: "pending"},order:[['priority']]}).then((requests)=>{
        let promises = []
        for(request of requests)
            promises.push(args.db.User.findOne({where: {ipfs:request.dataValues.sender}}))

        Promise.all(promises).then((users)=>{
            for(let i=0 ; i<requests.length ; i++)
                requests[i].dataValues.sender = users[i].dataValues.name
                
            return {requestType: "Pending" , requests:requests}
        })
    })
}

// Returns a list of all the created close requests-whether as consumer or service provider
async function createdcRequests(args){
    args.db.ServiceRequest.findAll({where: {status: "created"}}).then((requests)=>{
        let promises = []
        for(request of requests)
            promises.push(args.db.User.findOne({where: {ipfs:request.dataValues.sender}}))

        Promise.all(promises).then((users)=>{
            for(let i=0 ; i<requests.length ; i++)
                requests[i].dataValues.sender = users[i].dataValues.name
                
            return {requestType: "Created" , requests:requests}
        })
    })
}

// Returns a list of all the close requests to be acknowledged as an SP (Step 2)
async function createdspRequests(args){
    args.db.ServiceRequest.findAll({where: {status: "created",display:"2"}}).then((requests)=>{
        let promises = []
        for(request of requests)
            promises.push(args.db.User.findOne({where: {ipfs:request.dataValues.sender}}))

        Promise.all(promises).then((users)=>{
            for(let i=0 ; i<requests.length ; i++)
                requests[i].dataValues.sender = users[i].dataValues.name
                
            return {requestType: "CreatedSP" , requests:requests}
        })
    })
}

// Returns a list of all the close requests to be acknowledged as a consumer (Step 3)
async function spackRequests(args){
    args.db.ServiceRequest.findAll({where: {status: "sp_ack",display:"2"}}).then((requests)=>{
        let promises = []
        for(request of requests)
            promises.push(args.db.User.findOne({where: {ipfs:request.dataValues.sender}}))

        Promise.all(promises).then((users)=>{
            for(let i=0 ; i<requests.length ; i++)
                requests[i].dataValues.sender = users[i].dataValues.name
                
            return {requestType: "SP_Acknowledged" , requests:requests}
        })
    })
}

// Returns a list of all the resolved requests
async function cackRequests(args){
    args.db.ServiceRequest.findAll({where: {status: "c_ack"}}).then((requests)=>{
        let promises = []
        for(request of requests)
            promises.push(args.db.User.findOne({where: {ipfs:request.dataValues.sender}}))

        Promise.all(promises).then((users)=>{
            for(let i=0 ; i<requests.length ; i++)
                requests[i].dataValues.sender = users[i].dataValues.name
                
            return {requestType: "Resolved" , requests:requests}
        })
    })
}


// Sends requests to the SP
async function addRequests(sender_ipfs,args){
    args.db.ServiceRequest.create({sender:sender_ipfs , status: "sent"}).then((result)=>{
        args.node.id().then((info)=>{
            let msg = {
                sender : info.id,
                recipient: sender_ipfs,
                action: message.messageAction.REQUEST
            }
            console.log(sender_ipfs)
            message.sendMessageToUser(msg ,sender_ipfs).then((result)=>{ 
                console.log("Request successfully added")
            })
        })
    })
}

// Deletes request
async function deleteRequests(sender_name,args){
    args.db.User.findOne({where: {name:sender_name}}).then((sender)=>{
        args.db.ServiceRequest.destroy({where: {sender: sender.dataValues.ipfs, status: "sent"}}).then((result)=>{
            args.node.id().then((info)=>{
                message.sendMessageToUser({
                    sender: info.id,
                    recipient: sender.dataValues.ipfs,
                    action: message.messageAction.DELETE
                } , sender.dataValues.ipfs).then((result)=>{
                    console.log("Request successfully deleted")
                })
            })
        })
    })
}

// Initiates the resolution process from consumer's side and creates a close request
async function createcRequests(sender_name,args){
    args.db.User.findOne({where: {name:sender_name}}).then((sender)=>{
    args.db.ServiceRequest.destroy({where: {sender: sender.dataValues.ipfs, status: "sent"}}).then((result)=>{
    args.db.ServiceRequest.create({sender:sender.dataValues.ipfs , status: "created",display:"1"}).then((result)=>{   
        args.node.id().then((info)=>{
            message.sendMessageToUser({
                sender: info.id,
                recipient: sender.dataValues.ipfs,
                action: message.messageAction.C_CREATE
            } , sender.dataValues.ipfs).then((result)=>{
                console.log("Close request sent.")
            })
        })
    })
})
})
}

// Initiates the resolution process from SP's side
async function spcreatecRequests(sender_name,args){
    args.db.User.findOne({where: {name:sender_name}}).then((sender)=>{
        args.db.ServiceRequest.destroy({where: {sender: sender.dataValues.ipfs, status: "pending"}}).then((result)=>{
        args.db.ServiceRequest.create({sender:sender.dataValues.ipfs , status: "created",display:"2"}).then((result)=>{  
        args.node.id().then((info)=>{
            message.sendMessageToUser({
                sender: info.id,
                recipient: sender.dataValues.ipfs,
                action: message.messageAction.SP_C_CREATE
            } , sender.dataValues.ipfs).then((result)=>{
                console.log("Close request sent.")
            })
        })
    })
})
})
}


