const socket = io()

const form = document.querySelector('#message-form')
const input = form.querySelector('input')
const button = form.querySelector('button')
const $msgShow = document.querySelector('#messages')
const shareLoc = document.querySelector('#send-location')


const $msg = document.querySelector('#msg-temp').innerHTML
const $msgLoc = document.querySelector('#loc-msg-temp').innerHTML
const $side = document.querySelector('#side').innerHTML


const {username , room } = Qs.parse( location.search , { ignoreQueryPrefix:true})


socket.on('roomdata', ({ room, users }) => {
    const html = Mustache.render($side, {
        room,
        users
    })
    console.log(html)
    document.querySelector('#sidebar').innerHTML = html
})


// const autoscroll = () => {
//     // New message element
//     const $newMessage = $messages.lastElementChild

//     // Height of the new message
//     const newMessageStyles = getComputedStyle($newMessage)
//     const newMessageMargin = parseInt(newMessageStyles.marginBottom)
//     const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

//     // Visible height
//     const visibleHeight = $messages.offsetHeight

//     // Height of messages container
//     const containerHeight = $messages.scrollHeight

//     // How far have I scrolled?
//     const scrollOffset = $messages.scrollTop + visibleHeight

//     if (containerHeight - newMessageHeight <= scrollOffset) {
//         $messages.scrollTop = $messages.scrollHeight
//     }
// }

socket.on('msg', (msg)=>{

    // const show = document.querySelector('#show')    
    // show.textContent += '  '+ msg
    // show.testContent = msg
    console.log(msg)
    const html = Mustache.render($msg , {
        name:msg.username,
        message:msg.text,
        createdAt:moment(msg.time).format('h:mm a')
    })

    $msgShow.insertAdjacentHTML('beforeend' , html)
    // autoscroll()
})


socket.on('locationmsg' , (message)=>{
    console.log(message)
    const html  = Mustache.render( $msgLoc , {
        name:message.username,
        url:message.text,
        createdAt:moment(message.time).format('h:mm a')
    })
    $msgShow.insertAdjacentHTML('beforeend' , html)
    // autoscroll()
})

form.addEventListener('submit' , (e)=>{
    e.preventDefault()
    button.setAttribute('disabled','disabled')

    socket.emit('sentMsg' , e.target.elements.message.value , (res)=>{
        if(res)
            return console.log(res)
        console.log('hey sever here, msg received by server')
        button.removeAttribute('disabled')
        input.value = ''
        input.focus()
    })
})

shareLoc.addEventListener('click' , ()=>{

    shareLoc.setAttribute('disabled'  , 'disabled')
    if(!navigator.geolocation)
        return alert('GeoLocation  not supported')
    
    // we using callback bze geolocation not support promises
    navigator.geolocation.getCurrentPosition((pos)=>{
        console.log(pos)
        socket.emit('sendlocation'  , { latitude: pos.coords.latitude , longitude:pos.coords.longitude},()=>{
            console.log('Hey server here, Location shared with other users')
            shareLoc.removeAttribute('disabled')
        })
    })
})

socket.emit('join'  , {username , room } , (err)=>{
    if(err)
    {
        alert(err)
        location.href = '/'
    }
})