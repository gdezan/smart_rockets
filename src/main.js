const canvasContainer = document.querySelector(".canvas");
const countText = document.querySelector(".count");
const generationText = document.querySelector(".generation");
const maxFit = document.querySelector(".max-fit");
const startButton = document.querySelector(".start-button");
const playPauseButton = document.querySelector(".play-pause-button");
const resetButton = document.querySelector(".reset-button");
const elementsValue = document.querySelector("#elements-value");
const elementsSlider = document.querySelector("#elements-slider");

let populationSize = 25;
const lifespan = 200;
const mutationRate = 0.01;

const obstacle = { x: 150, y: 200, w: 200, h: 10 };

let population;
let target;
let maxFitness;
let count;
let generation;
let started;
let playing;
let obstacles;

let currRect = { x: 0, y: 0, w: 0, h: 0 };

function resetState(options = {}) {
  const { keepPlaying = false, resetObstacles = true } = options;
  started = keepPlaying;
  playing = keepPlaying;
  count = 0;
  generation = 1;
  maxFitness = 0;
  if (resetObstacles) {
    obstacles = [obstacle];
  }
  population = new Population(Rocket, populationSize, lifespan, mutationRate, obstacles);
  elementsSlider.value = populationSize;
  elementsValue.textContent = populationSize;
  countText.textContent = `Frames: ${count}`;
  generationText.textContent = `Generation: ${generation}`;
  maxFit.textContent = `Maximum fitness: ${maxFitness.toFixed(4)}`;
}

function setup() {
  const canvas = createCanvas(500, 400);
  canvas.mousePressed(onCanvasMousePressed);
  canvas.mouseReleased(onCanvasMouseReleased);
  canvas.parent("canvas");

  target = createVector(width / 2, 100);
  spawn = createVector(width / 2, height - 50);
  resetState();
  noLoop();
}

function draw() {
  background(0);
  ellipse(target.x, target.y, 16, 16);
  ellipse(spawn.x, spawn.y, 16, 16);
  fill(255);

  for (i in obstacles) {
    let obs = obstacles[i];
    rect(obs.x, obs.y, obs.w, obs.h);
  }

  if (!started) {
    return;
  }

  population.run();
  countText.textContent = `Frames: ${count}`;
  count++;

  if (mouseIsPressed && mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
    currRect.w = mouseX - currRect.x;
    currRect.h = mouseY - currRect.y;
    rect(currRect.x, currRect.y, currRect.w, currRect.h);
  }

  if (count >= lifespan) {
    count = 0;
    maxFitness = population.evaluate(target);
    population.selection();
    generation++;
    generationText.textContent = `Generation: ${generation}`;
    maxFit.textContent = `Maximum fitness: ${maxFitness.toFixed(4)}`;
  }
}

function onCanvasMousePressed() {
  currRect = {};
  currRect.x = mouseX;
  currRect.y = mouseY;
}

function onCanvasMouseReleased() {
  obstacles.push(currRect);
}

startButton.addEventListener("click", () => {
  started = true;
  playing = true;
  loop();
});

playPauseButton.addEventListener("click", () => {
  playing = !playing;
  if (playing) {
    loop();
    playPauseButton.textContent = "Pause";
  } else {
    noLoop();
    playPauseButton.textContent = "Play";
  }
});

resetButton.addEventListener("click", () => {
  resetState({ keepPlaying: true });
});

elementsSlider.addEventListener("input", (e) => {
  elementsValue.textContent = e.target.value;
});
elementsSlider.addEventListener("change", (e) => {
  populationSize = e.target.value;
  resetState({ keepPlaying: true, resetObstacles: false });
});
