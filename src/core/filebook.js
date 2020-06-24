const IPFS = require('ipfs')
const path = require('path')
const Room = require('ipfs-pubsub-room')
const database = require('../../models/database')
const cryptography = require('../util/cryptography')

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

module.exports =
{   
    uploadfile:uploadfile,    
    getFilebook:getFilebook
}