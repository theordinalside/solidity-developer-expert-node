const express = require('express');
const router = require('./routers/router');
const routerNew = require('./routers/indexRoute');
const controller = require('./controllers/controler');
const app = express()
app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));
require('./dbConnectivity/mongodb');
const cors = require('cors');
const fileUpload = require('express-fileupload')
app.use(cors());
require("./scheduler/cron");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(fileUpload({useTempFiles: true}))
var swaggerDefinition = {
  info: {
    title: "Samad_Tracker",
    version: "2.0.0",
    description: "Samad Tracker API DOCS",
  },
  host: `${global.gConfig.swaggerURL}`,
  basePath: "/",
};

var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ["./routers/*/*.js"],
};

var swaggerSpec = swaggerJSDoc(options);

app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// initialize swagger-jsdoc

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', router);
app.use('/api/v1', routerNew);


var WebSocketServer = require('websocket').server;
var http = require('http');
var WebSocketClient = require('websocket').client;

var server = http.createServer(app)
var client = new WebSocketClient();
var result;
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
    maxReceivedFrameSize: 64 * 1024 * 1024,   // 64MiB
    maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
    fragmentOutgoingMessages: false,

    keepalive: false,
    disableNagleAlgorithm: false
});


function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

// Node.js WebSocket server script

wsServer.on('request', async function (request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    const connection = request.accept('', request.origin);
    console.log('Line no ===>>61   ' + (new Date()) + ' Connection accepted.');
    connection.on('message', async function (message) {
        console.log("Line no 64====>", message.utf8Data.tokenAddress, typeof (message.utf8Data))
        var type = JSON.parse(message.utf8Data);
        console.log('Received Message:', message, typeof (message.utf8Data), type);

        ///////**************** socket ById **********************/
        if (type.tokenAddress) {
            console.log("Line no 51====server===>>", type.tokenAddress)
            connection.sendUTF(allApiSocket(type.tokenAddress))
            //  setTimeout(connection.sendUTF(allApiSocket(type.tokenAddress)),10000)
        }
        if (type.address) {
            console.log("Line no 90====server===>>", type.address)
            connection.sendUTF(allApiSocketV2(type.address))
            //  setTimeout(connection.sendUTF(allApiSocket(type.tokenAddress)),10000)
        }
        if (type.contractAddress) {
            console.log("Line no 51====server===>>", type.contractAddress)
            connection.sendUTF(getDataWithContact(type.contractAddress))
            //  setTimeout(connection.sendUTF(allApiSocket(type.tokenAddress)),10000)
        }

    });
    async function allApiSocket(tokenAddress) {
        if (connection.connected) {
            console.log("58===>>tokenAddress==>", tokenAddress)
            result = await controller.allApiSocket(tokenAddress)
            if (result) {
                var data = JSON.stringify(result);
                connection.sendUTF(data);
                // connection.sendUTF(result.responseResult);
                // connection.sendUTF(result.responseResult.toString());
            }
            setTimeout(() => {
                allApiSocket(tokenAddress)
            }, 5000);
            // await setTimeout(allApiSocket, 10000);
        }
    }

    async function allApiSocketV2(tokenAddress) {
        if (connection.connected) {
            console.log("120===>>tokenAddress==>", tokenAddress)
            result = await controller.allApiSocketV2(tokenAddress)
            if (result) {
                var data = JSON.stringify(result);
                connection.sendUTF(data);
                // connection.sendUTF(result.responseResult);
                // connection.sendUTF(result.responseResult.toString());
            }
            setTimeout(() => {
                allApiSocketV2(tokenAddress)
            }, 5000);
            // await setTimeout(allApiSocket, 10000);
        }
    }
    async function getDataWithContact(contractAddress) {
        if (connection.connected) {
            console.log("113===>>contractAddress==>", contractAddress)
            result = await controller.getDataWithContact(contractAddress)
            if (result) {
                var data = JSON.stringify(result);
                connection.sendUTF(data);
                // connection.sendUTF(result.responseResult);
                // connection.sendUTF(result.responseResult.toString());
            }
            setTimeout(() => {
                getDataWithContact(contractAddress)
            }, 5000);
            // await setTimeout(allApiSocket, 10000);
        }
    }
    connection.on('close', function (reasonCode, description) {
        console.log(new Date() + ' Peer ' + connection.remoteAddress + 'Client has disconnected.');
    });
    connection.on('connectFailed', function (error) {
        console.log('Connect Error: ' + error.toString());
    });
});


client.connect('ws://182.72.203.245:1832/', '');
// client.connect('ws://localhost:1832/', ''); 


server.listen(1832, (err, _result) => {
    if (err) {
        console.log("server error", err)
    }
    else {
        console.log("Server is listening at 1832")
    }
})
