const express = require('express')
const http = require('http')
const path = require('path')
const socket = require('socket.io')
const Filter = require('bad-words')
const genmsg  = require('../src/utils/msg')
const {addUser , removeUser , getUser , getUserByRoom } = require('../src/utils/user')


const app = express()
const server = http.createServer(app)
const io = socket(server)

const port = process.env.PORT
const publicPath = path.join( __dirname , '../public')

app.use( express.static(publicPath))

// app.get('/' ,  (req, res)=>{
//     res.render('index')
// })
var count = 0

io.on('connection' , (socket)=>{
    console.log('New connection!')
    socket.on('join' , ({username, room} , callback)=>{
        const {error , user}= addUser({ id:socket.id , username, room})
        // console.log(user)
        if(error)
            return callback(error)
        socket.join(user.room)

        io.to(user.room).emit('roomdata' ,{ room:user.room , users:getUserByRoom(user.room)})
        
        socket.emit('msg' , genmsg(user.username , 'Welcome!'))
        socket.broadcast.to(user.room).emit('msg' , genmsg(user.username , `${user.username} is connected!`))
        


        callback()
    })

    socket.on('sentMsg' , (msg , callback)=>{
        const user = getUser(socket.id)

        if(!user)
            callback('Join some room!')

        const filter = new Filter()

        if(filter.isProfane(msg))
            return callback('Profanity is not allowed')
        io.to(user.room).emit('msg' , genmsg(user.username , msg))
        callback()
    })

    socket.on('sendlocation', (pos, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationmsg' , genmsg(user.username , `https://www.google.com/maps?q=${pos.latitude},${pos.longitude}`))
        callback()
    })

    socket.on('disconnect' , (msg)=>{
        const user = removeUser(socket.id)
        console.log(user)
        if(user)
        {
          io.to(user.room).emit('msg' , genmsg(user.username , `${user.username} has left`))
            
        io.to(users.room).emit('roomdata' ,{ room:user.room , users:getUserByRoom(user.room)})
        }
    })

    //smaple 
    // console.log('fun_test')
    // socket.emit('fun_name' , count)
    // socket.on('inc' , ()=>{
    //     count++
    //     io.emit('fun_name' , count)   // here io means will call fun_name event for all client but you can create one local variable then use socket.emit it will create ne local count var for all client and handle them 
    // })
})
server.listen(port, (err,  )=>{
    console.log('Connected at',port)
})