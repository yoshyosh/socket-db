// connect to the socket server
var socket = io.connect(); 

// if we get an "info" emit from the socket server then console.log the data we recive
socket.on('info', function (data) {
    console.log(data.msg);
});

socket.on('user count', function(data){
  $(".user-count").text(data);
});

socket.on('live update', function(data){
  var nextUp = data;
  changeLiveSpeaker(nextUp.theatre, nextUp.title)
});

$(document).ready(function(){
  $('.all-talks').on('click', '.speaker-title', function(e){
    e.preventDefault();
    var title = $(this).text();
    var theatre = $(this).attr("data-theatre");
    var speaker = $(this).attr("data-speaker");
    var nextUp = { title: title, speaker: speaker, theatre: theatre};
    socket.emit('live update', nextUp); // Message server to update all clients
  });
});

function changeLiveSpeaker(theatre, title){
  if (theatre == "Theatre 14") {
    $("#live-theatre-14").text(title);
  } else {
    $("#live-theatre-15").text(title);
  }
}

