class Rocket {
  constructor(lifespan, mutationRate, dna = null) {
    this.position = createVector(width / 2, height - 50);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.dna = dna || new DNA(lifespan, mutationRate);
    this.fitness = 0;
    this.count = 0;
    this.completed = -1;
    this.crashed = false;
    this.lifespan = lifespan;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  calcFitness(target) {
    const distance = dist(this.position.x, this.position.y, target.x, target.y);
    if (this.completed > 0) {
      this.fitness = Math.pow((this.lifespan - this.completed) / 50 + 1, 3) + 1;
    } else {
      this.fitness = 10 / (distance - 10);
    }

    if (this.crashed) {
      this.fitness = this.fitness / 10;
    }

    return this.fitness;
  }

  update(obstacles) {
    if (this.completed > 0 || this.crashed) {
      return;
    }

    const { x: px, y: py } = this.position;
    if (dist(px, py, target.x, target.y) < 10) {
      this.completed = frameCount % this.lifespan;
      this.position = target.copy();
    }

    for (let i = 0; i < obstacles.length; i++) {
      let { x: ox, y: oy, w: ow, h: oh } = obstacles[i];
      if (px > ox && px < ox + ow && py > oy && py < oy + oh) {
        this.crashed = true;
      }
    }

    if (px > width || px < 0 || py > height || py < 0) {
      this.crashed = true;
    }
    this.applyForce(this.dna.genes[this.count]);
    this.count++;

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    push();
    noStroke();
    fill(255, 150);
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    // rectMode(CENTER);
    // rect(0, 0, 25, 5);
    triangle(-10, -5, -10, 5, 10, 0);
    pop();
  }
}
