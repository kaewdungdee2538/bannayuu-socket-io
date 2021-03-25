const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
io.on("connection", socket => {
    const ip = socket.handshake.address;
    console.log('client connect : '+socket.id+'IP : '+ ip +" Date : " + Date.now().toString());
    socket.emit("socket_id", socket.id);
    socket.on("send_sos", body => {
        console.log('data : '+JSON.stringify(body))
        io.emit("message_sos"+body.company_id, body)
    })
})
server.listen(9000, () => console.log("server is running on port 9000"));