chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});

//----------------------------------------------------------------APPEND ONCLICK

var initiate = true;
var currNode1 = "";
var latitude = "";
var longitude = "";
var seenNodes = new Set();

var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);


/*document.querySelector('body').addEventListener('click', function (event) {
  if (document.querySelector('.selection_bubble').style.visibility == "visible" && initiate == false) {
    currNode1.classList.remove('highlighted2');
    bubbleDOM.style.visibility = 'hidden';
    initiate = true;
  }
});*/

function renderLoading() {}

/*  background-image: url('logoYhack.png');
  background-size: cover;
  width: 15px;
  height: 15px;*/

function renderDone(mouseX, mouseY) { //TODO FIX THIS
  /*var bubbleDone = document.createElement('div');
  bubbleDone.style.backgroundImage = chrome.extension.getURL("logoYhack.png");
  bubbleDone.style.width = '50px';
  bubbleDone.style.height = '50px';
  bubbleDone.style.backgroundSize = 'cover';
  bubbleDone.setAttribute('class', 'doNotPropagate');
  document.body.appendChild(bubbleDone);
  bubbleDone.style.top = mouseY + 'px';
  bubbleDone.style.left = mouseX + 'px';
  bubbleDone.style.visibility = 'visible';*/
}

function renderBubble(mouseX, mouseY, selection, language) {
  bubbleDOM.textContent = "Originally: " + selection;
  mouseY = mouseY /*- bubbleDOM.offsetHeight*/;
  mouseX = mouseX + bubbleDOM.offsetWidth;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
  initiate = false;
}

function unrenderBubble(mouseX, mouseY, selection, language) { //TODO check its fine
  bubbleDOM.style.visibility = 'hidden';
  initiate = true;
}

//----------------------------------------------------------------Main functions
async function onMessage(message) {
  const active = message;
  if (active) {
    setLatLong(); //TODO PERSISTENT TOGGLE
  }
  else {
    console.log('inactive');
  }
}

async function setLatLong() {
  navigator.geolocation.getCurrentPosition(function(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    doIt(); //TODO IDEALLY DO DO IT AND THAT SEPERATELY WITH SETLATLONG HAPPENING ON PAGE LOAD
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations, observer) {
        doIt();
    });
    observer.observe(document, {
      subtree: true,
      attributes: true
    });
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

async function queryBackend(imageURL, node) {
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
  const sendLocationAndImage = await fetch('https://tranquil-headland-43776.herokuapp.com/travelInfo', request); //sends the image and coords //TODO populate the URL
  const finishSending = await sendLocationAndImage.json(); //gets back json with origin airport etc.
  console.log(finishSending);
  renderDone(getOffset(node).left + node.offsetWidth, getOffset(node).top); //TODO MAKE SURE AFTER
}

function createInteractiveImageModal(newNode1) {
  newNode1.addEventListener('mouseenter', function() {
    if (currNode1 != "" ) currNode1.classList.remove('highlighted2');
    newNode1.classList.add('highlighted2');
    currNode1 = newNode1;
    renderBubble(getOffset(newNode1).left + newNode1.offsetWidth/3, getOffset(newNode1).top - newNode1.offsetHeight/3, "image", "yahoo");
  });
  newNode1.addEventListener('mouseleave', function() {
    if (currNode1 != "" ) currNode1.classList.remove('highlighted2');
    newNode1.classList.remove('highlighted2');
    unrenderBubble(getOffset(newNode1).left + newNode1.offsetWidth/3, getOffset(newNode1).top - newNode1.offsetHeight/3, "image", "yahoo");
  });
}

function returnImages(node) {
  if (!seenNodes.has(node)) {
    if (node.nodeType == Node.ELEMENT_NODE && !node.classList.contains('doNotPropagate')) {
      if (node.nodeName == "IMG") { //background image css, background css, src
        queryBackend(node.src, node); //not sure if it works
        createInteractiveImageModal(node);
      }
      else if (node.nodeName == "DIV") {
        if (node.style.backgroundImage != 'none' && node.style.backgroundImage != "") {
          queryBackend(node.style.backgroundImage, node);
          createInteractiveImageModal(node);
        }
      }
    }
    seenNodes.add(node);
  }
  for (const child of node.childNodes) {
    returnImages(child);
  }
}
