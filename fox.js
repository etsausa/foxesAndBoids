class Fox extends Entity {
    constructor(x, y, mass, maxSpeed, maxForce, id) {
        super(x, y, mass, maxSpeed, maxForce, id);

        this.turn = 0;

        //colors-- changes color for user fox
        if (this.id == 0) {
            this.orange = color(70, 135, 220);
        } else {
            this.orange = color(220, 120, 70);
        }
        
        this.white = color(250, 250, 250);
        this.black = color(10, 10, 10);

    }
    //ACTIONS
    //----------------

    pack(foxes) {
        //!kinda broken, needs work
        //foxes will flock but movement is mad weird
        
        let sep = this.separate(foxes); // Separation
        let ali = this.align(foxes); // Alignment
        let coh = this.cohesion(foxes); // Cohesion
        // Arbitrarily weight these forces
        sep.mult(2.5 * this.unity);
        ali.mult(2.0 * this.unity);
        coh.mult(2.0 * this.unity);
        // Add the force vectors to acceleration

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }


    //BEHAVIORS
    //----------------

    behaviors(flock, target, foxes) { //MOVE LOOP

        this.metabolize();

        let arrive = this.arrive(target);
        let eat = this.eat(flock, flock.boids);


        if (this.id == 0) {
            //user agent follows mouse
            this.applyForce(arrive);
        } else {
            //AIs forage
            this.applyForce(eat);
            //this.pack(foxes); not fully working
        }

        this.borders();
        this.update();
        this.render();

    }

    //RENDERING-----------------------------------------------------------------------------------------
    getDir() {
        let heading = this.vel.heading() + radians(90);

        if (keyIsDown(68)) { //D
            this.turn += 0.1;
        }
        if (keyIsDown(65)) { //A
            this.turn -= 0.1;
        }

        this.dir = heading;
        //this.dir += this.turn;

        return this.dir;
    }

    render() {
        this.r = this.mass * 20;
        let size = this.r / 2;
        let theta = this.getDir();
        let mouse = createVector(mouseX, mouseY);

        let tail = 7; //8
        let body = 3; //0
        let head = 0; //3

        push();

        translate(this.pos.x, this.pos.y);
        rotate(theta);

        strokeJoin(ROUND);
        strokeWeight(5);

        push();
        translate(0, size * tail);
        this.tail(size);
        pop();

        push();
        translate(0, size * body);
        this.body(size);
        pop();

        push();
        translate(0, size * -head);
        this.head(size);
        pop();

        pop();
        
        //debug rendering
        //super.render();
    }
    tail(size) {
        stroke(this.orange);
        fill(this.orange);

        //tail
        triangle(size * -0.5, size * 0,
            size * 0.5, size * 0,
            size * 0, size * (0 + 2));

        triangle(size * -0.5, size * 0,
            size * 0.5, size * 0,
            size * 0, size * (0 - 4));
    }
    body(size) {
        stroke(this.orange);
        fill(this.orange);

        triangle(size * -1, size * 0,
            size * 1, size * 0,
            size * 0, size * (0 - 4));

        triangle(size * -1, size * 0,
            size * 1, size * 0,
            size * 0, size * (0 + 1));


        scale(0.5);
        translate(0, size * -3);
        stroke(this.white);
        fill(this.white);

        triangle(size * -1, size * 3,
            size * 1, size * 3,
            size * 0, size * -1);

        triangle(size * -1, size * 3,
            size * 1, size * 3,
            size * 0, size * 4);
        translate(0, size * 3);

        scale(2);

    }
    head(size) {

        stroke(this.orange);
        fill(this.orange);
        triangle(size * -1, size * 0,
            size * 1, size * 0,
            size * 0, size * -2);

        translate(0, size * -1.5);

        scale(0.5);
        stroke(this.white);
        fill(this.white);
        triangle(size * -1, size * 0,
            size * 1, size * 0,
            size * 0, size * -2);

        noStroke();
        fill(this.black);
        ellipse(size * 0, size * -2, size);
        translate(0, size * 1.5);
        scale(2);
    }
}
