var mqtt = require('mqtt'), url = require('url');

var url = 'mqtt://test.mosquitto.org';

var options = {
  port: 1883,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
//   username: "orahiadmin",
//   password: "Orahi@3214",
};

var topic_1 = "pds/device/0352503092010153";

// Create a client connection
var client = mqtt.connect(url, options);

client.on('connect', function () {
    client.subscribe(topic_1, function (err) {
        if (!err) {
            // client.publish('test', 'Hello mqtt')
            console.log("mqtt connected!!!!")
            console.log(err)
          }else{
              console.log(err)
        }
    })
  })
   
  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
  })