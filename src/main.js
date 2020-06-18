const canvasContainer = document.querySelector(".canvas");

// Info panel
const countText = document.querySelector(".count");
const generationText = document.querySelector(".generation");
const maxFit = document.querySelector(".max-fit");

// Playback buttons
const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");
const stopButton = document.querySelector("#stop-button");

// Sliders
const elementsValue = document.querySelector("#elements-value");
const elementsSlider = document.querySelector("#elements-slider");
const speedValue = document.querySelector("#speed-value");
const speedSlider = document.querySelector("#speed-slider");
const lifespanValue = document.querySelector("#lifespan-value");
const lifespanSlider = document.querySelector("#lifespan-slider");
const mutationValue = document.querySelector("#mutation-value");
const mutationSlider = document.querySelector("#mutation-slider");

let populationSize = 25;
let lifespan = 200;
let mutationRate = 0.01;
let rocketSpeed = 3;

const isMobile = window.orientation > -1;

const canvasWidth = isMobile ? 300 : 500;
const obstacleWidth = isMobile ? 120 : 200;
const obstacle = { x: (canvasWidth - obstacleWidth) / 2, y: 200, w: obstacleWidth, h: 20 };

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
  const { keepPlaying = false, resetObstacles = true, stop } = options;
  started = stop != null ? !stop : started;
  playing = started && keepPlaying;
  count = 0;
  generation = 1;
  maxFitness = 0;
  if (resetObstacles) {
    obstacles = [obstacle];
  }
  population = new Population(Rocket, populationSize, lifespan, obstacles);

  elementsSlider.value = populationSize;
  elementsValue.textContent = populationSize;
  speedSlider.value = rocketSpeed;
  speedValue.textContent = rocketSpeed;
  mutationSlider.value = mutationRate * 500;
  mutationValue.textContent = `${(mutationRate * 100).toFixed(2)}%`;
  countText.textContent = `Frames: ${count}`;
  generationText.textContent = `Generation: ${generation}`;
  maxFit.textContent = `Maximum fitness: ${maxFitness.toFixed(4)}`;
}

function setup() {
  const canvas = createCanvas(canvasWidth, 400);
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

  population.run(rocketSpeed);
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
    population.selection(mutationRate);
    generation++;
    generationText.textContent = `Generation: ${generation}`;
    maxFit.textContent = `Maximum fitness: ${maxFitness.toFixed(4)}`;
  }
}

function onCanvasMousePressed() {
  if (isMobile) return;
  currRect = {};
  currRect.x = mouseX;
  currRect.y = mouseY;
}

function onCanvasMouseReleased() {
  if (isMobile) return;
  obstacles.push(currRect);
}

playButton.addEventListener("click", () => {
  started = true;
  playing = true;
  loop();
  accentPlaybackButton(playButton);
});

pauseButton.addEventListener("click", () => {
  if (started) {
    if (playing) {
      playing = false;
      noLoop();
    }
    accentPlaybackButton(pauseButton);
  }
});

stopButton.addEventListener("click", () => {
  resetState({ stop: true });
  accentPlaybackButton(stopButton);
  redraw();
});

elementsSlider.addEventListener("input", (e) => {
  elementsValue.textContent = e.target.value;
});
elementsSlider.addEventListener("change", (e) => {
  populationSize = e.target.value;
  resetState({ keepPlaying: true, resetObstacles: false });
});

lifespanSlider.addEventListener("input", (e) => {
  lifespanValue.textContent = `${e.target.value} frames`;
});
lifespanSlider.addEventListener("change", (e) => {
  lifespan = parseInt(e.target.value);
  resetState({ keepPlaying: true, resetObstacles: false });
});

speedSlider.addEventListener("input", (e) => {
  speedValue.textContent = e.target.value;
});
speedSlider.addEventListener("change", (e) => {
  rocketSpeed = parseInt(e.target.value);
});

mutationSlider.addEventListener("input", (e) => {
  mutationValue.textContent = `${(e.target.value / 5).toFixed(2)}%`;
});
mutationSlider.addEventListener("change", (e) => {
  mutationRate = e.target.value / 500;
});

function accentPlaybackButton(button) {
  const playbackButtons = [playButton, pauseButton, stopButton];
  playbackButtons.forEach((playbackButton) => {
    if (playbackButton === button) {
      playbackButton.classList.add("accent-svg");
    } else {
      playbackButton.classList.remove("accent-svg");
    }
  });
}
