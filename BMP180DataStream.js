var BMP085 = require('sensor_bmp085');

var sense = new BMP085({
  'sensorMode': 'ultraLowPower',
  'maxTempAge': 30,
});

var err, Val;
sense.init(function(err, val) {
if(!err){
	console.log('Sensor initialisation successful');
    }else{
 	console.log('Inititalisation failed:', err);
} });

function monitor(err, val) {
	setInterval(function(){
    		sense.getTemperature(function(err, val) {
      			if (!err) {
        			console.log('Temperature',val + ' °C');
        		}else
				console.log('Temperaute Error:', err);
			});


    		sense.getPressure(function(err, val) {
      			if (!err) {
        			console.log('Pressure',val );
        		}else
				console.log('Pressure Error:', err);
			});
		console.log('');

	}, 1000)
};

monitor();
