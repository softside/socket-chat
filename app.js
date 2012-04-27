var express = require('express');

var app = express.createServer();
var io = require('socket.io').listen(1377);

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
});

var conns = {};
io.sockets.on('connection', function (socket) {
    var cid = socket.id;
    for(var ccid in conns) {
        var soc = conns[ccid];
        soc.emit('join', {cid: socket.id});
    }
    conns[cid] = socket;

    socket.on('disconnect', function () {
        delete conns[cid];
        for(var cid in conns) {
            var soc = conns[cid];
            soc.emit('quit', {cid: cid});
        }
    });
    socket.on('nickname', function (data) {
	 socket.nickname = data;
	 socket.broadcast.emit('announcement', nick + ' connected');
    
    });

    socket.on('say', function (data) {
        data.cid = cid; 
        for(var ccid in conns) {
            var soc = conns[ccid];
            soc.emit('broadcast', data);
        }
    });
});
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.use('/public', express.static(__dirname + '/public'));

app.listen(3000);
console.log('daemon start on http://localhost:3000');

