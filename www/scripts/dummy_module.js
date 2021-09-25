//To act as haptic simulator

var motorid = 1;
var PORT = 3333;
var HOST = '127.0.0.1';


var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

server.on('message', function (message, remote) {
  //Date Time
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();
  //Date Time ends

  //console.log(remote.address + ':' + remote.port +' - ' + message);
  console.log("["+year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds+"] \t"+remote.address + ': \t' + message);
  //console.log();

});

server.bind(PORT, HOST);