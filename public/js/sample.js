const socket = io()

socket.on('fun_name',(count)=>{
    console.log('hello ved lets meet on client console', count)
})


document.querySelector('#inc').addEventListener('click' , ()=>{
    socket.emit('inc')
    console.log('clicked')
})