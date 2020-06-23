async function getPendingRequests(limit, offset, args) {
    args.db.PendingRequest.findAll({
        order: [
            ['priority']
        ],
        limit: limit,
        offset: offset
    }).then((requests)=>{
        let promises = []
        for(request of requests)
            promises.push(args.db.User.findOne({where: {ipfs:request.dataValues.sender}}))

        Promise.all(promises).then((users)=>{
            for(let i=0 ; i<requests.length ; i++)
                requests[i].dataValues.sender = users[i].dataValues.name
            
            return requests
        })
    })
}