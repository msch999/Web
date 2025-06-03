import Grid from "./src/grid.js";

export function generateSokobanLevel(parameters = {}) {
  let {
    width = 9,
    height = 9,
    boxes = 3,
    minWalls = 13,
    attempts = 5000,
    seed = Date.now(),
    initialPosition,
    type = "string",
  } = parameters;

  let grid = new Grid(width, height, boxes, seed, minWalls, initialPosition);

  while (--attempts > 0) {
    if (!grid.applyTemplates()
      || !grid.isGoodCandidate()
      || !grid.redeployGoals()
      || !grid.generateFarthestBoxes()) {
      continue;
    }

    if (type === "string") {
      return grid.toReadableString();
    }

    if (type === "class") {
      return grid;
    }

    console.warn(`sokoban-generator/generateSokobanLevel: Unrecognized value for key "string": ${type}. It should be either "string" or "class`);
    return grid.toReadableString();
  }

  return null;
}

// var myrng = new Math.seedrandom('Aabcdefh');
// var myrng = new Math.seedrandom();
var myrng = new Math.seedrandom('hello.');
//console.log(myrng());                // Always 0.9282578795792454
// console.log(myrng());                // Always 0.3752569768646784
const options = {
  width: 9, // the width of the sokoban grid 
  height: 6, // the height of the sokoban grid
  boxes: 3, // the boxes on the grid
  minWalls: 13, // the minimum number of walls on the grid
  attempts: 5000, // when generating the map, the maximum attempts
  seed: myrng(), // map seed. See note below
  initialPosition: { // The initial position of player
    x: 3,
    y: 0
  },
  type: "class", // the return type, either "string" or "class" 
};

var somethingThere = generateSokobanLevel(options);

if (!somethingThere) {
  console.error('Failed to generate a valid Sokoban level.');
  document.getElementById("sokoban-generator-test-output").innerHTML = "<h2>Failed to generate a valid Sokoban level.</h2>";
} 

console.log('somethingThere:\n', somethingThere);

var readableStr = somethingThere._data.toReadableString();
console.log(somethingThere._data.Grid);

var outStr = '';
var claz = null;
var w = options.width + 1;
var h = options.height;
for (let i = 0; i < readableStr.length; i++) {
  if (i > 0 && i % w === 0) {
    outStr += '<br>';
  }
  var c = readableStr[i];
  switch (c) {
    case ' ':
      claz = 'emptyspace'; // empty space
      c = '&nbsp;'; // use non-breaking space for HTML
      break;
    case '.':
      claz = 'goal'; // goal
      break;
    case '$':
      claz = 'box'; // box
      break;
    case '*':
      claz = 'boxongoal'; // box on goal
      break;
    case '@':
      claz = 'player'; // player
      break;
    case '#':
      claz = 'wall'; // wall
      break;
    default:
      claz = 'unknown'; // unknown character, default to black
  }

  outStr += '<span class=' + claz + '>' + c + '</span>'; 
}

//outStr = outStr.replace(/ /g, '&nbsp'); 
console.log('outStr:\n', outStr);
document.getElementById("sokoban-generator-test-output").innerHTML =
  "<h2>" + outStr + "</h2>" +
  "<p>Width: " + options.width + ", Height: " + options.height + ", Boxes: " + options.boxes + ", MinWalls: " + options.minWalls + ", Attempts: " + options.attempts + ", Seed: " + options.seed + "</p>" +
  "<p>Initial Position: (" + options.initialPosition.x + ", " + options.initialPosition.y + ")</p>" +
  "<p>Type: " + options.type + "</p>" +
  "<p>Generated at: " + new Date().toLocaleString() + "</p>";
