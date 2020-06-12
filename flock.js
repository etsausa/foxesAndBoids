class Flock {
    constructor() {
        this.boids = []
        this.boidsPOS = []
        this.index = 0;
        
    }

    run(foilage, pack) {
        for (let i = 0; i < this.boids.length; i++) {
            this.boids[i].behaviors(this.boids, foilage, pack); // Passing the entire list of boids to each boid individually
            this.checkDeadBoids(this.boids[i]);
        }
    }

    create(size) {
        // Add an initial set of boids into the system
        for (let i = 0; i < size; i++) {

            let newDNA = new DNA();
            newDNA.genBoidDNA();

            let b = new Boid(random(width), random(height), newDNA, this.index);
            
            flock.add(b);
            
            this.index++;
        }
    }

    add(b) {
        this.boids.push(b);
        console.log("Boid spawned: " + b.id);
        console.log(b)
    }

    remove(id) {
        for (let i = 0; i < this.boids.length; i++) { //check all 
            if (this.boids[i].id == id) { //if current fruit matches id
                this.boids.splice(i, 1); //remove from list
                console.log("Boid " + id + " removed");
            }
        }
    }


    checkDeadBoids(b) {
        if (this.boids.length > 0) {
            if (b.dead()) {
                console.log("Boid " + b.id + " died of starvation")
                this.remove(b.id);       
            }
        }
    }
}
