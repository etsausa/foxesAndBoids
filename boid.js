class Boid extends Entity {
    constructor(x, y, mass, maxSpeed, maxForce, id) {
        super(x, y, mass, maxSpeed, maxForce, id);
        this.vel = createVector(random(-1, 1), random(-1, 1));

        this.r *= 2;
        this.perc *= 2;


    }
    //ACTIONS
    //----------------


    flee(enemies) {
        let flee = this.repel(enemies, enemies.foxes);

        flee.mult(this.fear);
        this.applyForce(flee);
    }

    forage(food) {

        let eat = this.eat(food, food.fruits);
        if (eat) {
            eat.mult(this.hunger);
            this.applyForce(eat);
            return true;
        }
    }

    flock(boids) {
        let sep = this.separate(boids); // Separation
        let ali = this.align(boids); // Alignment
        let coh = this.cohesion(boids); // Cohesion

        if (sep && ali && coh) {
            // Arbitrarily weight these forces
            sep.mult(1.5 * this.unity);
            ali.mult(1.0 * this.unity);
            coh.mult(1.0 * this.unity);
            // Add the force vectors to acceleration

            this.applyForce(sep);
            this.applyForce(ali);
            this.applyForce(coh);
            return true;
        }
    }

    reproduce(boids) {
        let mate = this.findMate(boids);
        
        if (mate) {
            this.applyForce(mate);
            return true;
        }
    }


    //Behaviors
    //----------------
    behaviors(boids, foilage, pack) {

        this.metabolize(); //uses energy

        this.flee(pack); //move away from enemies
        this.forage(foilage); //searches for food
        this.reproduce(boids); //find mate
        this.flock(boids); //maintains flock

        this.borders(); //bounces off of borders
        this.update(); //calcs new velocity
        this.render(); //draw

    }

    mate(mate) {
        super.mate(mate);
        console.log("this genes: " + this.DNA.genes);
        let mateDNA = mate.DNA.genes;
        console.log("mate genes: " + mateDNA);
        let offSpringGenes = this.DNA.combine(mateDNA);
        console.log("resulting genes: " + offSpringGenes);

        let offSpringDNA = new DNA(offSpringGenes);

        this.energy = this.energy / 2;
        let baby = new Boid(this.pos.x, this.pos.y, offSpringDNA, flock.boids.length);

        flock.add(baby);
        console.log("Boid Born");
    }

    //RENDERING-----------------------------------------------------------------------------------------
    render() {
        this.r = this.mass * 20;
        let size = this.r / 2;
        let theta = this.vel.heading() + radians(90);

        let colormod = this.energy / this.energyCap;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta);

        strokeJoin(ROUND);
        strokeWeight(1);

        fill(colormod * 200);
        stroke(colormod * 200);

        triangle(size * -1, size * 1,
            size * 1, size * 1,
            size * 0, size * -2);


        fill(colormod * 255);
        stroke(colormod * 255);

        triangle(size * -0.5, size * 1,
            size * 0.5, size * 1,
            size * 0, size * -2);


        pop();

        //super.render();

    }
}
