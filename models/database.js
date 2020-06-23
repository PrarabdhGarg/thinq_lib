'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);


async function db_init(args){
    let db_path = args.hasOwnProperty('dbPath')? args.dbPath : path.join(__dirname , "database.sqlite3")
    
    let db = {}

    let sequelize = new Sequelize({
        "dialect": "sqlite",
        "storage": db_path
    })

    fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });
    
    return db
}

module.exports = {
    db_init : db_init
}

