var mqtt = require('mqtt')
  , client = mqtt.connect('mqtt://username:password@YOUR_MQTT_SERVER?clientId=CLIENT_ID');
client.subscribe('TOPIC/#');

client.on('message', function (topic, message) {
  console.log(message);
});

