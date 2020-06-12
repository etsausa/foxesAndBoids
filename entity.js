class Entity {
    constructor(x, y, DNA, id) {
        this.pos = createVector(x, y); //
        this.DNA = DNA;

        //Body
        this.mass = DNA.genes[0]; //size of character and relevant intertia
        this.massMAX = this.mass + (this.mass * 0.25);
        this.massMIN = this.mass - (this.mass * 0.25);

        //Movement
        this.maxSpeed = DNA.genes[1]; //max VEL
        this.maxForce = DNA.genes[2]; //max ACC

        //Behavioral Traits
        this.fear = DNA.genes[3];
        this.hunger = DNA.genes[4];
        this.unity = DNA.genes[5];
        this.perc = (this.maxSpeed * 100) * this.mass;

        //Metabolism
        this.energyCap = this.maxSpeed * this.mass; //totaly energy capacity
        this.energy = this.energyCap; //init energy to full
        this.meta = (this.mass * 0.0002) * this.maxSpeed; //


        //Properties
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.dir = 0.0; //heading
        this.r = this.mass * 20; //determines hitbox

        this.id = id;

    }
    //ACTIONS
    //----------------
    applyForce(f) {
        //takes a force
        //f = p5.Vector.div(f, this.mass); //divides force by mass
        this.acc.add(f); //adds product to a
    }

    metabolize() {
        //energy use

        if (this.vel.mag() > 0.05) {
            //movement
            this.energy -= this.meta * this.vel.mag();
        } else {
            //stationary
            this.energy -= this.meta;
        }


        if (this.energy > this.energyCap) {
            //growing
            //if you have extra energy
            if (this.mass < this.massMAX) {
                this.mass += (this.mass * 0.1);
                this.energy -= this.energyCap / 4;
            }
        }

        if (this.energy < 0) {
            //starving
            //trade mass for energy to prevent death
            if (this.mass > this.massMIN) {
                this.mass -= (this.mass * 0.1);
                this.energy += this.energyCap / 4;
            }
        }
    }

    //STATES
    //----------------
    dead() {
        if (this.energy < 0) {
            return true;
        } else {
            return false;
        }
    }

    //Behaviors
    //----------------
    mate(mate) {
        console.log("entity: " + this.id + " mated with entity: " + mate.id);
    }

    collision(entity) {
        //checks if this collided with another entity
        let d = dist(this.pos.x, this.pos.y, entity.pos.x, entity.pos.y);

        if (d < this.r + entity.r) {
            return true;
        } else {
            return false;
        }
    }
    //MOVEMENT
    arrive(target) {
        //move directly to target and slow upon arrival

        let dist = 100; //should be responsive to size

        let desired = p5.Vector.sub(target, this.pos); //calc vector towards destination

        //DEBUG--
        if (this.id == 0) {
            stroke(255);
            fill(255, 0, 0, 50);
            ellipse(target.x, target.y, dist, dist);
            line(this.pos.x, this.pos.y, target.x, target.y); //DRAW vector
        }




        let d = desired.mag(); //get magnitude of vector
        let speed = this.maxSpeed; //default speed is max

        if (d < dist) { //if within range
            speed = map(d, 0, dist, 0.0, this.maxSpeed); //map speed to 
            //params: desired mag, center, radius, zeroSpeed, maxSpeed) 
        }

        desired.setMag(speed);
        let steer = p5.Vector.sub(desired, this.vel); //calcualte acceleration
        steer.limit(this.maxForce); //acceleration limiter

        return steer; //apply acceleration
    }

    seek(target) {
        //move directly to target
        let desired;

        if (target.pos == null) {
            desired = p5.Vector.sub(target, this.pos);
        } else {
            desired = p5.Vector.sub(target.pos, this.pos);
        }

        desired.normalize();
        desired.mult(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.vel)
        steer.limit(this.maxForce);

        return steer;

    }
    //ATTRACTIONS
    findMate(entities) {
        //steers towards any mate 

        let record = Infinity;
        let closest = null;
        let perception = this.perc;

        if (this.energy > (this.energyCap * 2)) {
            for (let i = entities.length - 1; i >= 0; i--) {
                const d = this.pos.dist(entities[i].pos); //distance to 

                if (this.collision(entities[i]) && entities[i].id != this.id) {
                    this.mate(entities[i]);
                } else {
                    if (d < record && d < perception) {
                        record = d;
                        closest = entities[i].pos;
                    }
                }

                if (closest != null) {
                    return this.seek(closest);
                }

                return createVector(0, 0);
            }
        }
    }

    repel(entities, list) {
        //moves away from enemies
        let record = Infinity;
        let closest = null;
        let perception = this.perc;


        for (let i = list.length - 1; i >= 0; i--) {
            const d = this.pos.dist(list[i].pos);

            if (d < record && d < perception) {
                record = d;
                closest = list[i];
            }

        }

        if (closest != null) {
            let seek = this.seek(closest);
            seek.mult(-1);
            return (seek); //return the inverse of seek
        }

        return createVector(0, 0);
    }

    eat(entities, list) {
        //steers towards food 
        let record = Infinity;
        let closest = null;
        let perception = this.perc;


        for (let i = list.length - 1; i >= 0; i--) { //check all
            if (list[i] == null) {
                //ERROR HANDLING - bad data will break loop
                break;
            }
            const d = this.pos.dist(list[i].pos); //distance to 

            if (this.collision(list[i])) {

                let id = list[i].id;
                let gain = list[i].mass * 0.05;

                entities.remove(id);

                this.energy += gain;

            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }

        // This is the moment of eating!

        if (closest != null) {
            return this.seek(closest);
        }

        return createVector(0, 0);
    }

    //GROUP FLOCKING BEHAVIORS ---
    separate(entities) {
        //dont overlap
        let desiredseparation = this.r * 8;
        let steer = createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < entities.length; i++) {
            let d = p5.Vector.dist(this.pos, entities[i].pos);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.pos, entities[i].pos);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.vel);
            steer.limit(this.maxForce);
        }
        return steer;

    }

    align(entities) {
        //face the same direction
        let neighbordist = this.r * 10;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < entities.length; i++) {
            let d = p5.Vector.dist(this.pos, entities[i].pos);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(entities[i].vel);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steer = p5.Vector.sub(sum, this.vel);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    cohesion(entities) {
        //stay close
        let neighbordist = this.r * 10;
        let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < entities.length; i++) {
            let d = p5.Vector.dist(this.pos, entities[i].pos);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(entities[i].pos); // Add location
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum); // Steer towards the location
        } else {
            return createVector(0, 0);
        }

    }
    //WORLD
    borders() {
        //bounce off wall [seems to be broken]
        /*
        const d = 5;

        let desired = null;

        if (this.pos.x < d) {
            desired = createVector(this.maxSpeed, this.vel.y);
        } else if (this.pos.x > width - d) {
            desired = createVector(-this.maxSpeed, this.vel.y);
        }

        if (this.pos.y < d) {
            desired = createVector(this.vel.x, this.maxSpeed);
        } else if (this.pos.y > height - d) {
            desired = createVector(this.vel.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxSpeed);
            const steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }
        */

        //boundry wrap    
        if (this.pos.x < -this.r) this.pos.x = width + this.r;
        if (this.pos.y < -this.r) this.pos.y = height + this.r;
        if (this.pos.x > width + this.r) this.pos.x = -this.r;
        if (this.pos.y > height + this.r) this.pos.y = -this.r;
    }

    //GAME LOOP
    //------------------------------------------------------------------------------------------------------
    update() {
        //This loop takes movement variables and applies them to position
        this.vel.add(this.acc); //add acceration to velocity
        this.vel.limit(this.maxSpeed); //limit new velocity to max speed
        this.pos.add(this.vel); //apply velocity to position

        this.acc.mult(0); //reset acc
    }

    render() {
        //debug rendering

        //hitbox
        stroke(255, 0, 0, 50)
        fill(255, 0, 0, 50)
        ellipse(this.pos.x, this.pos.y, this.r);

        //perception
        fill(0, 255, 0, 25)
        ellipse(this.pos.x, this.pos.y, this.perc);

    }
}
