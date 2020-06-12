class Pack {
    constructor() {
        this.foxes = [];
        this.index = 0;
        this.isUserDead = false;

    }

    run(food, target) {
        for (let i = 0; i < this.foxes.length; i++) {

            this.foxes[i].behaviors(food, target, this.foxes); // Passing the entire list of boids to each boid individually
            //this.checkFoxColBoid(this.foxes[i]);

            this.checkDeadFoxes(this.foxes[i]);
        }
    }

    create(size) {
        // Add an initial set of boids into the system
        for (let i = 0; i < size; i++) {

            let newDNA = new DNA();
            newDNA.genFoxDNA();

            let f = new Fox(random(width), random(height), newDNA, this.index);

            pack.add(f);

            this.index++;
        }
    }

    add(f) {
        this.foxes.push(f);

        console.log("Fox spawned: " + f.id);
        console.log(f)
    }

    remove(i) {
        this.foxes.splice(i, 1);
        console.log("Fox removed: " + i);
    }


    /*checkFoxColBoid(f) {
        //checks if fox collides with any boid in flock
        for (let i = 0; i < flock.boids.length; i++) {
            if (f.collision(flock.boids[i])) {
                f.energy += flock.boids[i].energy;
                flock.removeBoid(i);
            }

        }
    }*/
    
    checkDeadFoxes(f) {
        if (f.dead()) {
            this.remove(f.id);
            console.log("Fox " + f.id + " died of starvation")
            
            if(f.id === 0){
                this.isUserDead = true;
            }

        }
        
        if (this.isUserDead) {
            //doesnt work for some reason 
            //only displays for one frame
                textSize(50);
                stroke(0);
                fill(200, 0, 0);
                //text("Your Fox Starved to Death :/", (windowWidth / 2) - 200, windowHeight / 2);
        }


    }
}
