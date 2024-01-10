const {Client} = require('pg')

const dbClient = new Client({
    host: 'localhost',
    port: '5432',
    database: 'todo',
    user: 'postgres',
    password: '963741'
})

dbClient.connect((err)=>{
    if(err){
        console.error('Connection error: ',err)
    }else{
        console.log('Connected!!')
    }
})

module.exports = dbClient