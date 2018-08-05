var client = io();
var printerH  = $('messages').innerHeight();
var preventNewScroll = false;

$('#msgForm').submit(function(){
  client.emit('chatMessage', $('#m').val());
  $('#m').val('');
  return false;
});


client.on('chatMessage', function(msg){
  console.log("Client on chat message: " + msg);
  addNewMessageToChatLog(msg);
  scrollBottom();
});

function addNewMessageToChatLog(message)
{
  var newMessageDiv = createMessageForChatLog(message);
  $('#messages').append(newMessageDiv);
}

function createMessageForChatLog(msgTxt)
{
  var messageDiv = createMessageDiv();
  var messageP = createMessageParagraph(msgTxt);
  var messageImage = createMessageImage();
  $(messageDiv).append(messageImage);
  $(messageDiv).append(messageP);
  return messageDiv;
}

function createMessageDiv(){
    return $("<div></div>", {
    class : 'messageDiv'
  });
}

function createMessageParagraph(messageText){
    var messagePara = $("<p></p>",{
    class : 'messageParagraph'
  });
  messagePara.text(messageText);
  return messagePara;
}

function createMessageImage(){
    return $("<img />", {
    class : 'messageImage',
    src : './UserImages/totoro.png'
  });
}

function scrollBottom(){
  if(!preventNewScroll)
  { // if mouse is not over printer
    $('#messages').stop().animate( {scrollTop: $('#messages')[0].scrollHeight}, 500); // SET SCROLLER TO BOTTOM
  }
}

$('#messages').hover(function( e ) {
  preventNewScroll = e.type=='mouseenter' ? true : false ;
  if(!preventNewScroll){ scrollBottom(); } // On mouseleave go to bottom
});