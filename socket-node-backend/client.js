const io = require("socket.io-client");

const express = require("express");
const app = express();

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
const socket = io("https://cit.bannayuu.com:4070");

console.log(socket.id); // undefined

socket.on("connect", () => {
  console.log(socket.id); // "G5p5..."

});

// client-side
socket.emit("send_sos", {company_id:1});
app.listen(8000, () => console.log("server is running on port 8000"));