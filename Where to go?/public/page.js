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

var bubbleTopBar = document.createElement('div');
bubbleTopBar.setAttribute('class', 'topBar');
bubbleDOM.appendChild(bubbleTopBar);

var column = document.createElement('div');
column.setAttribute('class', 'colll');
bubbleDOM.appendChild(column);

  var recTrip = document.createElement('span');
  recTrip.setAttribute('class', 'mommy');
  recTrip.textContent = "Recommended Trip";         // Create a text node
  column.appendChild(recTrip);

  var namePlace = document.createElement('span');
  namePlace.setAttribute('class', 'mommy');
  namePlace.textContent = "Venice, CA";
  namePlace.id = "whereTo";
  column.appendChild(namePlace);

  var row = document.createElement('div');
  row.setAttribute('class', 'rowww');
  column.appendChild(row);

  var origin = document.createElement('span');
  origin.setAttribute('class', 'mommy');
  origin.textContent = "EWR";
  origin.id = "from";
  row.appendChild(origin);

  var symbol = document.createElement('img');
  symbol.setAttribute('class', 'lilpicky');
  symbol.src = chrome.extension.getURL('route.png');
  row.appendChild(symbol);

  var dest = document.createElement('span');
  dest.setAttribute('class', 'mommy');
  dest.textContent = "LAX";
  dest.id = "to";
  row.appendChild(dest);

  var price = document.createElement('span');
  price.setAttribute('class', 'mommy');
  price.textContent = "Flights from $79/120p"
  price.id = "price";
  column.appendChild(price);

  var button = document.createElement('a');
  button.setAttribute('class', 'daddy mommy');
  button.textContent = "Check it out!";
  button.id = "buttonPress";
  column.appendChild(button);

function renderBubble(mouseX, mouseY, json) {
  var long = 'Recommended Trip: ' + json.DestinationAirportCode + '. From ' + json.OriginAirportCode + ' to ' + json.DestinationAirportCode + '. Price: $' + (parseFloat(json.FareDollarAmount) + parseFloat(json.TaxDollarAmount)).toFixed(2) + '. Points: ' + (parseFloat(json.FarePointsAmount) + parseFloat(json.TaxPointsAmount)).toFixed(2);
  console.log(long);
  document.querySelector("#whereTo").textContent = json.city;
  document.querySelector('#from').textContent = json.OriginAirportCode;
  document.querySelector('#to').textContent = json.DestinationAirportCode;
  document.querySelector('#price').textContent = "Flights from $" + (parseFloat(json.FareDollarAmount) + parseFloat(json.TaxDollarAmount)).toFixed(2) + "/" + (parseFloat(json.FarePointsAmount) + parseFloat(json.TaxPointsAmount)).toFixed(2) + "points";
  var mod = document.querySelector('#buttonPress');
  mod.href = "http://" + json.reactUrl;

  mouseX = mouseX + 5; //TODO CHANGE BACK AFTER TESTING------------------
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
  initiate = false;
}

function unrenderBubble(mouseX, mouseY) {
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
  createInteractiveImageModal(node, finishSending);
}

function createInteractiveImageModal(newNode1, json) {
  newNode1.addEventListener('mouseenter', function() {
    if (currNode1 != "" ) currNode1.classList.remove('highlighted2');
    newNode1.style = "outline: 2.5px solid #4891CE";
    currNode1 = newNode1;
    renderBubble(getOffset(newNode1).left + newNode1.offsetWidth, getOffset(newNode1).top, json);
  });
  newNode1.addEventListener('mouseleave', function() {
    setTimeout(function() {
      if (currNode1 != "" ) currNode1.classList.remove('highlighted2');
      newNode1.style = "outline: 0px";
      unrenderBubble(getOffset(newNode1).left + newNode1.offsetWidth, getOffset(newNode1).top);
    }, 4200);
  });
}

function returnImages(node) {
  if (!seenNodes.has(node)) {
    if (node.nodeType == Node.ELEMENT_NODE && !node.classList.contains('doNotPropagate')) {
      if (node.nodeName == "IMG") { //background image css, background css, src
        queryBackend(node.src, node); //not sure if it works
      }
      else if (node.nodeName == "DIV") {
        if (node.style.backgroundImage != 'none' && node.style.backgroundImage != "") {
          queryBackend(node.style.backgroundImage, node);
        }
      }
    }
    seenNodes.add(node);
  }
  for (const child of node.childNodes) {
    returnImages(child);
  }
}
