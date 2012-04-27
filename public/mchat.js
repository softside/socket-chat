var socket = io.connect("http://127.0.0.1:1377");

socket.on('quit', function (data) {
    status('Client ' + data.cid + ' quits!');
});

socket.on('join', function (data) {
    status('Client ' + data.cid + ' joins!');
});



socket.on('broadcast', function (data) {
    $('#thread').append($('<div>').html('client ' + data.cid + ' says:<br/>' + data.w));
});

function say() {
    var words = $('#text').val();
    if($.trim(words)) {
        socket.emit('say', {w: words});
        $('#text').val('');
    }
}

function nickname(){
    var nickname = $('#nickname').val();
    if ($.trim(nickname)){
	socket.emit('nickname',{nickname:nickname});
	$('.nickname').hide();
    }
  }

function status(w) {
    $('#status').html(w);
}

function initialize() {
    $(document).delegate('textarea', 'keydown', function (evt) {
            //console.info(evt.keyCode);
        if(evt.keyCode == 13 && evt.ctrlKey) {
            $('#send').focus().click();
        }
    });
}

