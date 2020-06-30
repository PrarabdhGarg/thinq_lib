const IPFS = require('ipfs')
const path = require('path')
const Room = require('ipfs-pubsub-room')
const database = require('../../models/database')
const cryptography = require('../util/cryptography')

// Uploads a file parsed using FileReader to ipfs,adds it to filebook and returns the hash of newly uploaded file
async function uploadfile(file,documentPath,filename,args){
    info = await args.node.id()
    let hash
    try {
        await args.node.files.write(documentPath, file, {create: true,parents: true})
    } catch(e) {
        console.log('Error in adding file to IPFS system')
        console.log(e)
    }
    respon = await args.node.files.stat(documentPath)
    hash = respon.hash
    console.log('Hash of uploaded file is = ' + hash)
    token = await args.db.FileBook.findOne({ where: { 'ipfs_hash':hash.toString()} })
    if(token === null) {
        args.db.FileBook.create({ipfs_hash: hash.toString(),name:filename})
        return hash.toString()
    }        
}

// Returns the filebook of a user
async function getFilebook(args){
    let files = await args.db.FileBook.findAll({})
    for(let i=0 ; i<files.length ; i++)
        files[i] = files[i].dataValues
    return files
}

module.exports = {   
    uploadfile:uploadfile,    
    getFilebook:getFilebook
}