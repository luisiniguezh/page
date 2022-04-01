simulationsQTY = 100
function executeMontyHall() {
  visualization = document.getElementById("visualization_result")
  visualization.innerHTML = ''; //reseting screen
  visualization2 = document.getElementById("visualization_result2")
  visualization2.innerHTML = ''; //reseting screen
  games = []
  results_without_switching = []
  results_with_switching = []
  for (let i = 0; i < simulationsQTY; i++) {
    car_position = getRandomInt(3)
    games[i] = generate_doors(car_position)
    selected = getRandomInt(3)
    showed = show_goat(selected, games[i])
    switched = [0,1,2].filter(n => ![selected,showed].includes(n))[0]
    draw_game(visualization, games[i], selected, false);
    draw_game(visualization2, games[i], selected, true, showed, switched);
    results_without_switching[i] = games[i][selected] == "car" ? 100 : 0
    results_with_switching[i] = games[i][switched] == "car" ? 100 : 0
  }
  percentage = results_without_switching.reduce((a, b) => a + b) / results_without_switching.length
  result = document.getElementById("result")
  result.innerHTML = ''; //reseting screen
  textnode = document.createTextNode("Won " + percentage + "% without switching door");
  result.appendChild(textnode);

  switching_percentage = results_with_switching.reduce((a, b) => a + b) / results_without_switching.length
  result2 = document.getElementById("result2")
  result2.innerHTML = ''; //reseting screen
  textnode = document.createTextNode("Won " + switching_percentage + "% with switching door");
  result2.appendChild(textnode);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generate_doors(car_position) {
	doors = Array(3).fill("goat")
  doors[car_position] = "car"
  return doors
}

function draw_game(element, game, selected, is_switching, showed, switched) {
  node = document.createElement("p");
  for (let i=0; i<3; i++) {
  	span = document.createElement("span");
    if(selected == i) span.classList.add('selected')
    if(showed == i) span.classList.add('shown')
    if(switched == i) span.classList.add('switched')
    node.appendChild(span)
    textnode = document.createTextNode(" [" + game[i] + "] ");
    span.appendChild(textnode);
  }
  element.appendChild(node);
  if(is_switching) selected = switched
  span = document.createElement("span");
  node.appendChild(span)
  if(game[selected] == "car") {
    textnode = document.createTextNode(" won!!");
    span.classList.add('won')
  }
  else {
    textnode = document.createTextNode(" lost");
    span.classList.add('lost')
  }
  span.appendChild(textnode);
}

function show_goat(selected, game) {
  goat = "none"
  while(goat == "none") {
    pos = getRandomInt(3)
    if(pos != selected && game[pos] != "car") goat = pos
  }
  return goat
}

function getSimulationsQty() {
  val = parseInt(document.querySelector("input[name='simulations_qty']").value);
  if(val >= 1 && val <= 10000) {
    simulationsQTY = val
  } else {
    simulationsQTY = NaN
    alert("please enter a valid qty between 1 and 10000")
  }
}
