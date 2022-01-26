
const genmsg  = ( username , text)=>{
    const date = new Date()
    return {
        username,
        text,
        time : date.getTime()
    }
}

module.exports = genmsg