const IPFS = require('ipfs')
const path = require('path')
const Room = require('ipfs-pubsub-room')
const database = require('../../models/database')
const cryptography = require('../util/cryptography')


async function init(args){
    let repo_path = args.hasOwnProperty('path') ? args.path : path.join(__dirname , 'ipfs/thinq/')
    let room_name = args.hasOwnProperty('rname') ? args.rname : 'room1'
    
    const node = await IPFS.create({
        repo: path.join(__dirname , repo_path),
        init: true,
        EXPERIMENTAL: {
            pubsub: true
        },
        config: {
            Addresses: {
              Swarm: [
                '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
              ]
            }
        }
    })

    const id = await node.id()
    console.log('IPFS node running with id ', id.id)
    const room = Room(node, room_name)

    let db = database.db_init(args)

    for(model of db)
        await model.sync({force: false})

    return {
        db : db ,
        node : node ,
        room : room
    }
}

async function register(init_info , args){
    args.node.id().then(async (info)=>{
        await cryptography.generateKeys()
        let public_key = cryptography.getPublicKey()

        Promise.all([args.node.add(public_key) , args.node.add(init_info.bio)]).then((stats) => {
            init_info['publicKey'] = stats[0][0].hash.toString()
            init_info['ipfs'] = info.id.toString()
            init_info['bio'] = stats[1][0].hash.toString()
            init_info['rating'] = '2.5'

            args.node.add(JSON.stringify(init_info)).then(([stat])=>{
                args.db.User.create({name:init_info.name , ipfs:info.id , bio:init_info.bio, publicKey:stats[0][0].hash.toString(), type:init_info.type , rating: '2.5' , filehash:stat.hash.toString()})
            })
        })
    })
}

async function addUser(id , args){
    args.node.get(id).then(([info])=>{
        let user_info = JSON.parse(info.content.toString())
        args.db.User.create({type:user_info.type , name:user_info.name , filehash:id , publicKey:user_info.publicKey , ipfs:user_info.ipfs , bio:user_info.bio , rating: user_info.rating})
    })
}


//to update self send the parameter in updates, to update others send filehash as a parameter in updates
async function updateInfo(updates , args , ipfs="self") {
    if(ipfs=="self")
        ipfs = (await args.node.id()).id
    args.db.User.findOne({where : {ipfs:ipfs}}).then(async (result) => {
        let prevFileHash = result.dataValues.filehash

        if(updates.hasOwnProperty('filehash')){
            await args.db.User.delete({where: {ipfs:ipfs}})
            addUser(filehash , args)
            return
        }

        args.node.get(prevFileHash).then(async([file]) => {
            data = JSON.parse(file.content.toString())
            
            if(updates.hasOwnProperty('bio')){
                let stat = await args.node.add(updates.bio)
                updates.bio = stat.hash.toString()
            }

            let new_info = result.dataValues

            for(key of Object.keys(updates))
                new_info[key] = updates[key]

            global.node.add(JSON.stringify(new_info)).then(([stat]) => {
                new_info.filehash = stat.hash.toString()

                global.User.update({new_info}, {where: {ipfs: ipfs}}).then((result1) => {
                    console.log('Database updated sucessfully')
                })
            })
        })
    })
}

async function getUsers(){
    let users = await args.db.User.findAll({})
    for(let i=0 ; i<users.length ; i++)
        users[i] = users[i].dataValues
        
    return users
}

// Uploads a file parsed using FileReader to ipfs,adds it to filebook and returns the hash of newly uploaded file
async function uploadfile(file,documentPath,filename,args){
    args.node.id().then(async (info)=>{  
        let hash
        args.node.files.write(documentPath, Buffer.from(file), {
                create: true,
                parents: true
            }, (err, resp) => {
                if(err) {
                    console.log("Error in inserting file " + err.message)
                } else {
                    args.node.files.stat(documentPath, (err, respon) => {
                        if(err) {
                        }
                        hash = respon.hash
                        console.log('Hash of uploaded file is = ' + hash)
                        args.db.FileBook.findOne({ where: { 'ipfs_hash':hash.toString()} }).then(async (token) => {
                            if(token === null)
                            {
                            args.db.FileBook.create({ipfs_hash: hash.toString(),name:filename})
                            return hash.toString()
                            }
                         })
                        })
                        
                    }
                })
})
}

// Returns the filebook of a user
async function getFilebook(){
    let files = await args.db.FileBook.findAll({})
    for(let i=0 ; i<files.length ; i++)
        files[i] = files[i].dataValues
    return files
}
module.exports = {
    init: init
}




