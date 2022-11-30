const express = require("express");
const app = express();
const fs = require("fs");
const getParcelHistoryBydID = require("./sos/sos");
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
const ApiRoute = require("./utils/config");
const port = ApiRoute.port;
const https = require("https");
const http = require("http");
var server = null

if (process.env.USE_HTTPS.toLowerCase() == "true") {
  console.log("HTTPS Mode")
  //----------------------Https
  server= https.createServer(
    {
      key: fs.readFileSync("C:/BinaryProgram/Cert/PriKey.pem"),
      cert: fs.readFileSync("C:/BinaryProgram/Cert/Cert.pem"),
      ca: fs.readFileSync("C:/BinaryProgram/Cert/FullChain.pem"),
      requestCert: false,
      rejectUnauthorized: false,
    },
    app
  );
} else {
  console.log("HTTP Mode")
  //---------------------Http
  server = http.createServer(app);
}

/*
socket io for version 2
*/
// // const server = https.createServer(app);
// const io = require("socket.io")(server, {
//     handlePreflightRequest: (req, res) => {
//         const headers = {
//             "Access-Control-Allow-Headers": "Content-Type, Authorization",
//             "Access-Control-Allow-Origin": "*", //or the specific origin you want to give access to,
//             "Access-Control-Allow-Credentials": true
//         };
//         res.writeHead(200, headers);
//         res.end();
//     }
// });
//---------------------------------------------------------//

/*
socket io for version 3
*/
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

io.on("connection", (socket) => {
  const ip = socket.handshake.address;
  console.log("<============================================>");
  console.log(
    "client connect : " + socket.id + "IP : " + ip + " Date : " + Date.now()
  );
  socket.emit("socket_id", socket.id);
  socket.on("send_sos", (body) => {
    const company_id = body.company_id;
    let resultForGetLastSosInfo = null;
    getParcelHistoryBydID(company_id)
      .then((res) => {
        if (res.result) {
          const sos_id = res.result.sos_id;
          const home_id = res.result.home_id;
          const home_address = res.result.home_address;
          const result = {
            error: null,
            result: {
              sos_id,
              home_id,
              home_address,
            },
            message: "เรียบร้อย",
            statusCode: 200,
          };
          resultForGetLastSosInfo = result;
          console.log(
            "get sos result : " + JSON.stringify(resultForGetLastSosInfo)
          );
          console.log("<------------------------------------------>");
        } else {
          console.log(res.error);
          const result = {
            error: res.error,
            result: null,
            message: res.error,
            statusCode: 200,
          };
          resultForGetLastSosInfo = result;
        }
      })
      .catch((err) => {
        console.log(err);
        const result = {
          error: err,
          result: null,
          message: "เชื่อมต่อล้มเหลว",
          statusCode: 200,
        };
        resultForGetLastSosInfo = result;
      })
      .finally((value) => {
        console.log("data : " + JSON.stringify(body));
        io.emit("message_sos" + body.company_id, resultForGetLastSosInfo);
      });
  });
});
server.listen(port, () => console.log("server is running on port " + port));
