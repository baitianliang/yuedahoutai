var express = require('express');
var fs = require('fs');
var http = require('http');
var app = express();
app.use(express.static('./dist'));
app.use(function (req, res,next) {
  res.sendfile('./dist/index.html');  //路径根据自己文件配置
});
var httpsServer = http.createServer(app);
httpsServer.listen(5001, function () {
  var host = httpsServer.address().address;
  var port = httpsServer.address().port;
  console.log('app listening at 127.0.0.1:5001', host, port);
});