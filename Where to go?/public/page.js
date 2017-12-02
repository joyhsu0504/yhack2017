chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

//----------------------------------------------------------------APPEND ONCLICK

var initiate = true;
var currNode1 = "";
//this.finish = this.finish.bind(this);

var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);
document.querySelector('body').addEventListener('click', function (event) {
  if (document.querySelector('.selection_bubble').style.visibility == "visible" && initiate == false) {
    currNode1.classList.remove('highlighted2');
    bubbleDOM.style.visibility = 'hidden';
    initiate = true;
  }
});

function renderBubble(mouseX, mouseY, selection, language) {
  bubbleDOM.textContent = "Originally: " + selection;
  mouseY = mouseY - bubbleDOM.offsetHeight;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
  initiate = false;
}

//----------------------------------------------------------------Main functions
//also do doIT() everytime something new loads on the DOM
async function onMessage(message) {
  const active = message;
  if (active) {
    doIt();
  }
  else {
    console.log('inactive');
  }
}

async function doIt() {
  //const word = new RegExp('\\b' + deckArray[i] + '\\b', "g"); //make it so if the word is an article like "the", find the word following
  //const translationQuery = await fetch('http://localhost:3000/getTranslation/' + encodeURIComponent(msg[1]) + '/' + encodeURIComponent(deckArray[i])); //current functionality for spanish
  //const translationJson = await translationQuery.json(); //THE FIX IS MAKE A SERVER WITH HTTPS THATS IT, ALSO CREATE A CATCH ^
  /*if (Object.values(translationJson) == 'success') {
    const translationFinish = await fetch('http://localhost:3000/finishTranslation/' + encodeURIComponent(deckArray[i]));
    const finishJson = await translationFinish.json();
    const translationTemp = Object.values(finishJson);
    const translation = translationTemp[1]; //obviously this doesnt scale well
    const traverse = await traversePage(document.querySelector('body'), word, msg[1], translation, deckArray[i]);
    if (i == deckArray.length - 1) {
      const endIt = await finish();
    }
  }*/
  const traverse = await returnImages(document.querySelector('body'));
}

function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

function getLocation() { //only works on https due to nature of geolocation api

  return 
}

async function queryBackend(imageURL) {
  console.log("got an image with URL: " + imageURL);
  //const currLocation = getLocation();
  //throw an error if it failed
  const jsonObject = {
    latitude: 'Latitude',
    longitude: 'Longitude',
    image: imageURL
  };
  //const sendLocationAndImage = await fetch('');
  //const finishSending = await sendLocationAndImage.json(); //to continue...

}

function createInteractiveImageModal(newNode1) {
  newNode1.addEventListener('mouseenter', function() {
    newNode1.classList.add('highlighted');
  });
  newNode1.addEventListener('mouseleave', function() {
    newNode1.classList.remove('highlighted');
  });
  newNode1.addEventListener('click', function (event) {
    event.stopPropagation();
    if (currNode1 != "" ) currNode1.classList.remove('highlighted2');
    newNode1.classList.add('highlighted2');
    currNode1 = newNode1;
    renderBubble(getOffset(newNode1).left + newNode1.offsetWidth/3, getOffset(newNode1).top - newNode1.offsetHeight/3, "image", "yahoo");
  });
}

function returnImages(node) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    if (node.nodeName == "IMG") { //background image css, background css, src
      createInteractiveImageModal(node);
      queryBackend(node.src); //not sure if it works
      console.log("found an image node called: " + node);
    }
    else if (node.nodeName == "DIV") {
      if (node.style.backgroundImage != 'none') {
        createInteractiveImageModal(node);
        queryBackend(node.style.backgroundImage);
        console.log('There is a background image' + node);
      }
    }
  }
  for (const child of node.childNodes) {
    returnImages(child);
  }
}
