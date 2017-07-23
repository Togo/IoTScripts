var BMP085 = require('sensor_bmp085');
var commandLineArgs = require('command-line-args')
var optionDefinitions = [
  { name: 'url', alias: 'u', type: String },
  { name: 'messageType', alias: 'mr', type: String },
  { name: 'bearer', alias: 'b', type: String },
  { name: 'device', alias: 'd', type: String }
];
var options = commandLineArgs(optionDefinitions);
console.log(options);
var sense = new BMP085({
  'sensorMode': 'ultraLowPower',
  'maxTempAge': 30,
});

sense.init(function(err, val) {
if(!err){
	console.log('Sensor initialisation successful');
    }else{
 	console.log('Inititalisation failed:', err);
} });

function SapCloudUpload(argv){
    this.needle = require('needle');
    this.moment = require('moment');

    this.url = argv.url;
    this.bearer = argv.bearer;
    this.messageType = argv.messageType;
    this.device = argv.device,

    this.sendData =  function(temperature, pressure) {
        var options = {  headers: { 'Content-Type':'application/json', 
                                    'Authorization':'Bearer ' + this.bearer } };
        var data = { mode:"sync",
                     messageType: this.messageType,
                     messages:[{ device: this.device,
                                 temperature:temperature,
                                 pressure:pressure,
                                 timestamp:this.moment().format() }] };
        
        this.needle.post(this.url, data, options, function(err, resp) {
      			if (resp.statusCode != 200) {
        		 console.log('Data send',resp );
                 console.log(data);
        		}else
				  console.log('HTTP-Status:', resp.statusCode);
			});
}
};

var upload = new SapCloudUpload( 'https://iotmmss0017489667trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/data/cfa6ecf0-7369-4627-bac5-eef3d3fb4b59','74a6858a70a4dea41643152b38a06d47', '30f6a93f85adfa7fddc7', 'BMP180Indoor_1');

function monitor() {
    var temperature = -1,  
        pressure = -1;

	setInterval(function(){
            console.log('-------------------------------');
    		sense.getTemperature(function(err, val) {
      			if (!err) {
                temperature = val;
        	    console.log('Temperature',val + ' °C');
        		}else
				console.log('Temperaute Error:', err);
			});

    		sense.getPressure(function(err, val) {
      			if (!err) {
                    pressure = val;
        			console.log('Pressure',val );
        		}else
				console.log('Pressure Error:', err);
			});

    upload.sendData(temperature,pressure);
	}, 10000)
};

monitor();
