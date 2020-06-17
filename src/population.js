class Population {
  constructor(Element, size, lifespan, mutationRate, obstacles = []) {
    this.Element = Element;
    this.elements = [];
    this.populationSize = size;
    this.lifespan = lifespan;
    this.maxFitness = 0;
    this.totalFitness = 0;
    this.mutationRate = mutationRate;
    this.obstacles = obstacles;
    this.fitnessPool = [];

    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i] = new Element(this.lifespan, this.mutationRate);
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

  selection() {
    const Element = this.Element;
    let newElements = [];
    let parentA;
    let parentB;
    let childDNA;
    for (let i = 0; i < this.populationSize; i++) {
      parentA = this.getParent();
      parentB = this.getParent();
      childDNA = parentA.crossover(parentB);
      newElements[i] = new Element(this.lifespan, this.mutationRate, childDNA);
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
    let index;
    let count = 0;
    let safety = 50000;
    let element;
    while (count <= safety) {
      index = Math.floor(Math.random() * this.populationSize);
      element = this.elements[index];
      if (Math.random() <= element.fitness / this.totalFitness) {
        return element.dna;
      }
      count++;
    }
    console.warn("Reached safety on getParent");
    return this.elements[index].dna;
  }

  run() {
    for (let i = 0; i < this.populationSize; i++) {
      this.elements[i].update(this.obstacles);
      this.elements[i].show();
    }
  }
}
