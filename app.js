const express = require('express')
const path  = require('path')
const http = require('http');
const socketIO = require('socket.io');
const dbClient = require("./db.js")
const socketController = require('./controllers/socketController'); // Adjust the path based on your folder structure

const app = express()
const server = http.createServer(app)
const  io = socketIO(server)
let port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname+"/public")))


socketController(io);

console.log(port)
server.listen(port)