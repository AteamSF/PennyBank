//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
nlp = window.nlp_compromise;


var messages = [], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = 'Chatbot', //name of the chatbot
  talking = true, //when false the speach function doesn't work
  totalAmount = 100,
  items = {
    "play_station": 240, 
    "birthday_party": 250, 
    "coldplay_concert": 90,
    "protein_supplement": 58
  }

//****************************************************************
//edit this function to change what the chatbot says

function chatbotResponse(response) {
  talking = true;
  botMessage = "I'm confused"; //the default message 
   
 // if(typeof result !== undefined){
 //   console.log('undefined result : ', result);

  if (response.top_class == 'savings') {
    botMessage = 'your total amount is: ' + totalAmount + ' dollars'; 
  } else if (response.top_class == 'what_wishlist') {
    botMessage = 'You currently have the following items ' + ['play station ', 'birthday party ', 'concert tickets '].join(''); 
  } else {
    botMessage = ' error ';
  }

/*
  if(items == 'protein_supplement' || 
    items == 'play_station' || 
    items == 'birthday_party' ||
    items == 'coldplay_consert')
  {
    botMessage = items - totalAmount; 
  }*/
}


function apicall(method, url){
  let httprequest = new XMLHttpRequest(); 
  
  httprequest.open(method, url, true); 
  httprequest.onreadystatechange = function(){
    if(httprequest.status === 200 && httprequest.readyState === 4){
      let result = JSON.parse(httprequest.responseText);
      chatbotResponse(result); 
    }
  }
  httprequest.send(); 
} 


//this runs each time enter is pressed.
//It controls the overall input and output

function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox and sets it to lastUserMessage
    lastUserMessage = document.getElementById("chatbox").value;
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    //adds the value of the chatbox to the array messages
    messages.push(lastUserMessage);

    //apicall('GET', 'https://gateway.watsonplatform.net/natural-language-classifier/api'); 

    //Speech(lastUserMessage);  //says what the user typed outloud
    //sets the variable botMessage in response to lastUserMessage
    chatbotResponse();
    //add the chatbot's name and message to the array messages
    messages.push("<b>" + botName + ":</b> " + botMessage);
    // says the message using the text to speech function written below
    Speech(botMessage);
    //outputs the last few array elements of messages to html
    for (var i = 1; i < 8; i++) {
      if (messages[messages.length - i])
        document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
    }
  }
}

//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    speechSynthesis.speak(utterance);
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    getjson();
    newEntry();
    
  }
  if (key == 38) {
    console.log('hi')
      //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}

function getjson() {

    var watson = require('watson-developer-cloud');

    var natural_language_classifier = new watson.natural_language_classifier({
      username: '231d106b-8279-40e7-996e-f110fe115f2b',
      password: 'yd52CNnAsKSX',
      url: "https://gateway.watsonplatform.net/natural-language-classifier/api",
      version: 'v1'
    });

    natural_language_classifier.classify({
      text: document.getElementById("chatbox").value;,
      classifier_id: '589703x211-nlc-9529' },
      function(err, response) {
        if (err)
          console.log('error:', err);
        else
          result = response; 
          chatbotResponse(result); 
          console.log('this is a concole log: ', JSON.stringify(response, null, 2));
    });

}
//console.log('this is a concole log: ', JSON.stringify(response, null, 2));


