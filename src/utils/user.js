users = []

const addUser = ( {id, username, room})=>{

    if(!username || !room)
        return {error:"Please define a user and room !"}

        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

    const check = users.find((user) =>  user.username === username && user.room === room) 
    // console.log(check)
    if(check)
        return {error:'Username already taken!'}

    const  user = {
        id,username,room
    }
    users.push({id,username,room})
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)
    // console.log('hello' , index)
    if(index!=-1)
        return users.splice(index, 1)[0]

    return index
}

const getUser = (id)=>{
    return users.find((user)=> user.id === id)
}

const getUserByRoom = (room)=>{
    return users.filter((user)=>{
    return user.room === room
})
}
const x = addUser({
    id:20,
    username:'1',
    room:'1'
})

// console.log(x)
// let xx = addUser({
//     id:20,
//     username:'1',
//     room:'1'
// })

// console.log(xx)

// console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserByRoom
}