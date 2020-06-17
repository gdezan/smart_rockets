class DNA {
  constructor(length, mutationRate, genes = []) {
    this.genes = genes;
    this.length = length;
    this.mag = 0.5;
    this.mutationRate = mutationRate;

    if (genes.length === 0) {
      for (let i = 0; i < length; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(this.mag);
      }
    }
  }

  crossover(partner) {
    let childGenes = [];
    let cuttingPoint = Math.floor(Math.random() * this.genes.length);
    let currGene;
    for (let i = 0; i < this.genes.length; i++) {
      if (i > cuttingPoint) {
        currGene = this.genes[i];
      } else {
        currGene = partner.genes[i];
      }
      childGenes[i] = this.mutate(currGene);
    }
    return new DNA(this.length, mutationRate, childGenes);
  }

  mutate(gene) {
    let retVal = gene;
    if (Math.random() <= this.mutationRate) {
      retVal = p5.Vector.random2D();
      retVal.setMag(this.mag);
    }
    return retVal;
  }
}
