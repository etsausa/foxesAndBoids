class DNA {
    constructor(genes) {
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [0, 0, 0];
        }
        
        this.species = null;

    }

    genFoxDNA() {
        let ranMass = random(0.7, 1);
        let ranSpeed = random(1, 6);
        let ranForce = random(0.1, 1.5);
        
        let ranFear = random(2, 8);
        let ranHunger = random(0.5, 3);
        let ranUnity = random(1, 2);

        this.genes = [ranMass, ranSpeed, ranForce, ranFear, ranHunger, ranUnity];
        this.species = 0;

    }

    genBoidDNA() {
        let ranMass = random(0.2, 0.5);
        let ranSpeed = random(1, 6);
        let ranForce = random(0.01, 0.5);
        
        let ranFear = random(2, 8);
        let ranHunger = random(1, 6);
        let ranUnity = random(1, 2);

        this.genes = [ranMass, ranSpeed, ranForce, ranFear, ranHunger, ranUnity];
        this.species = 1;
    }
    
    combine(otherGenes){
        let newGenes = [];
        for (let i = 0; i < this.genes.length; i++) {
            let lowerBound;
            let upperBound;
            
            if(this.genes[i] >= otherGenes[i]){
                upperBound = this.genes[i];
                lowerBound = otherGenes[i];
            } else {
                lowerBound = this.genes[i];
                upperBound = otherGenes[i];      
            }
            
            let range = random(lowerBound, upperBound);
            
            newGenes[i] = range;
        }
        return newGenes;
        
    }
    
    copy() {
        // should switch to fancy JS array copy
        let newgenes = [];
        for (let i = 0; i < this.genes.length; i++) {
            newgenes[i] = this.genes[i];
        }

        return new DNA(newgenes);
    }

    mutate(m) {
        for (let i = 0; i < this.genes.length; i++) {
            let mutation = random(-m, m);
            this.genes[i] = this.genes[i] * mutation;

        }

    }
}
