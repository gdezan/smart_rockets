class Population {
  constructor(Element, size, lifespan, obstacles = []) {
    this.Element = Element;
    this.elements = [];
    this.populationSize = size;
    this.lifespan = lifespan;
    this.maxFitness = 0;
    this.totalFitness = 0;
    this.obstacles = obstacles;
    this.fitnessPool = [];

    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i] = new Element(this.lifespan);
    }
  }

  evaluate(target) {
    this.maxFitness = 0;
    this.totalFitness = 0;
    for (let i = 0; i < this.populationSize; i++) {
      const fitness = this.elements[i].calcFitness(target);
      this.totalFitness += fitness;
      this.fitnessPool[i] = this.totalFitness;
      if (fitness >= this.maxFitness) {
        this.maxFitness = fitness;
      }
    }
    return this.maxFitness;
  }

  selection(mutationRate) {
    const Element = this.Element;
    let newElements = [];
    let parentA;
    let parentB;
    let childDNA;
    for (let i = 0; i < this.populationSize; i++) {
      parentA = this.getParent();
      parentB = this.getParent();
      childDNA = parentA.crossover(parentB, mutationRate);
      newElements[i] = new Element(this.lifespan, childDNA);
    }
    this.elements = newElements;
  }

  getParent() {
    const value = Math.random() * this.totalFitness;
    for (i in this.fitnessPool) {
      if (this.fitnessPool[i] >= value) {
        return this.elements[i].dna;
      }
    }
    console.warn("Failed fitness pool");
    return this.elements[Math.floor(Math.random() * this.populationSize)].dna;
  }

  run(rocketSpeed) {
    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i].update(rocketSpeed, this.obstacles);
      this.elements[i].show();
    }
  }
}
