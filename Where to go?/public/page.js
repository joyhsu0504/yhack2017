chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

//----------------------------------------------------------------APPEND ONCLICK

var initiate = true;
var currNode1 = "";
var latitude = "";
var longitude = "";

document.addEventListener("DOMContentLoaded", function(event) {
  setLatLong(); //TODO CHANGE TO SETLATLONG etc
});
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
    //setLatLong(); //TODO PERSISTENT TOGGLE
    //doIt();
  }
  else {
    console.log('inactive');
  }
}

async function setLatLong() {
  navigator.geolocation.getCurrentPosition(function(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    //doIt(); //TODO IDEALLY DO DO IT AND THAT SEPERATELY WITH SETLATLONG HAPPENING ON PAGE LOAD
  });
}


async function doIt() {
  await returnImages(document.querySelector('body'));
}

function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

async function queryBackend(imageURL) {
  const jsonObject = {
    latitude: latitude,
    longitude: longitude,
    image: imageURL
  };
  const request = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(jsonObject)
  };
  console.log(jsonObject);
  //const sendLocationAndImage = await fetch('/travelInfo/', request); //sends the image and coords //TODO populate the URL
  //const finishSending = await sendLocationAndImage.json(); //gets back json with origin airport etc.
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
    event.preventDefault();
    if (currNode1 != "" ) currNode1.classList.remove('highlighted2');
    newNode1.classList.add('highlighted2');
    currNode1 = newNode1;
    renderBubble(getOffset(newNode1).left + newNode1.offsetWidth/3, getOffset(newNode1).top - newNode1.offsetHeight/3, "image", "yahoo");
  });
}

function returnImages(node) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    if (node.nodeName == "IMG") { //background image css, background css, src
      queryBackend(node.src); //not sure if it works
      createInteractiveImageModal(node);
    }
    else if (node.nodeName == "DIV") {
      if (node.style.backgroundImage != 'none' && node.style.backgroundImage != "") {
        queryBackend(node.style.backgroundImage);
        createInteractiveImageModal(node);
      }
    }
  }
  for (const child of node.childNodes) {
    returnImages(child);
  }
}
