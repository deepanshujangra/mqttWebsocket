const express = require('express');
var app = express();

var connection;

var mqtt = require('mqtt')
var options = {
    port: 1883,
    host: 'mqtt://mqtt.orahi.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'pds',
    password: 'Pds@orahi123',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
// var client  = mqtt.connect('mqtt:mqtt.orahi.com:1883')
var client = mqtt.connect('mqtt://mqtt.orahi.com', options);
var topic = "pds/device/0867857039274753"

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
     connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

//------------------------------------------------------------------------------------------------------------------------


app.get("/", (req, res) =>{
    res.send("hi there")
})
//---------------------------------------------------------------------------------------------------------------------------

// client.on('connect', function () {
//     client.subscribe('test', function (err) {
//       if (!err) {
//         // client.publish('test', 'Hello mqtt')
//         console.log("mqtt connected!!!!")
//         console.log(err)
//       }else{
//           console.log(err)
//       }
//     })
//   })
   
//   client.on('message', function (topic, message) {
//     // message is Buffer
//     console.log(message.toString())
//     client.end()
//   })

client.on('connect', function() { // When connected
    console.log('connected');
    // subscribe to a topic
    client.subscribe(topic, function() {
        console.log("sub!!!!!")
        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {
            console.log("Received '" + message + "' on '" + topic + "'");
      
            
            try {
                if (connection != 'undefined' && connection.connected) {
                    connection.sendUTF(message.toString());
                }

                console.log("entering try block");
                console.log("this message is never seen");
              }
              catch (e) {
                console.log("entering catch block");
                console.log(e);
                console.log("leaving catch block");
              }
            
        });
    });

    // publish a message to a topic
    // client.publish('topic1/#', 'my message', function() {
    //     console.log("Message is published");
    //     client.end(); // Close the connection when published
    // });
});







app.listen(7000, () => {
    console.log(`Started at port 7000`);
});

// app.listen(3000, function(){
//     console.log(`Started at port 7000`);
// });