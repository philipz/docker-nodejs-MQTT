var mqtt = require('mqtt')
  , client = mqtt.connect('mqtt://user:tradingbot@m2m.tradingbot.com.tw?clientId=nodejs_MQTT2influx');

var influx = require('influx');
var dbclient = influx({
  // or single-host configuration
  host : 'YOUR_INFLUXDB',
  port : 8086, // optional, default 8086
  username : 'USERNAME',
  password : 'PASSWORD',
  database : 'DATABASE'
});

client.subscribe('BOT/#');

client.on('message', function (topic, message) {
	toPoint(message, func_influx);
});

function toPoint(message, callback) {
	var temp = message.split(",");
	if (temp.length > 10) {
	   try {
		var name = temp[0];
		if (name.substring(0, 2) == "MX") {
			name = "MTX00";
		}
		var Bid = parseFloat(temp[1]);
		var Bc = parseInt(temp[2]);
		var Ask = parseFloat(temp[3]);
		var Ac = parseInt(temp[4]);
		var close = parseFloat(temp[5]);
		var high = parseFloat(temp[6]);
		var low = parseFloat(temp[7]);
		var TickQty = parseInt(temp[8]);
		var TQty = parseInt(temp[9]);
		var Ref = parseFloat(temp[10]);
		var Percent = ((close / Ref) - 1) * 100;
		Percent = Percent.toFixed(5);
		var points = {"Bid": Bid, "Bc": Bc, "Ask": Ask, "Ac": Ac, "close": close, "high": high, "low": low,
				"TickQty": TickQty, "TQty": TQty, "Ref": Ref, "Percent": Percent};
		callback && callback(name, points);
		return [name , points]; 
	   } catch (ex) {
   		console.error(ex);
  	   }
	} else {
		return null;
	}
}

var func_influx=function influxwrite(seriesName, point, dbclient) {
        dbclient.writePoint(seriesName, point, function(err) {
        if(err) {
                console.error('Influx writePoint Error:' + err);
                //throw err;
                dbclient = influx({
                // or single-host configuration
		host : 'YOUR_INFLUXDB',
		port : 8086, // optional, default 8086
		username : 'USERNAME',
		password : 'PASSWORD',
		database : 'DATABASE'
                });
                influxwrite(seriesName, point, dbclient);
        }       
        });     
}    
