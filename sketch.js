//Foxes and Boids
//Ethan Sausa
//05/2020

//Three things live in this world
//Foxes, Boids, and Fruit
//Fruit is stationary - it exists and grows

//Foxes and Boids are Entities, they can move around the world
//Boids flock together, look for fruit, look for mates, avoid foxes
//Foxes form packs, look boids, look for mates

//links:
///http://www.red3d.com/cwr/steer/ 

let flock;
let pack;

let mouse;

function setup() {
    createCanvas(windowWidth, windowHeight);

    foilage = new Foilage();
    foilage.create(100);

    flock = new Flock();
    flock.create(30);

    pack = new Pack();
    pack.create(2);

    if (pack.foxes[0]) {
        mouse = createVector(pack.foxes[0].pos.x, pack.foxes[0].pos.y);
    }
}


function draw() {
    background(70, 155, 70);

    foilage.run();

    flock.run(foilage, pack);

    pack.run(flock, mouse);
    
    debug();
    
    if (pack.foxes.length > 0) {
        debugEntity(pack.foxes[0]);
    } else if (flock.boids.length > 0) {
        //debugEntity(flock.boids[0]);
    }
}

function debug(){
    textSize(10);
    stroke(0);
    fill(255);
    text('flock size: ' + flock.boids.length, 10, 10);
    text('pack size: ' + pack.foxes.length, 10, 20);
    text('plants: ' + foilage.fruits.length, 10, 30);
}

function debugEntity(e) {
    textSize(10);
    stroke(0);
    fill(255);
    text('vel: ' + round(e.vel.x, 2) + " , " + round(e.vel.y, 2), 100, 10);
    //text('acc: ' + round(e.acc.x, 2) + " , " + round(e.acc.y, 2) + " | " + round(e.acc.mag(), 3), 100, 20);
    text('speed: ' + round(e.vel.mag(),3), 100, 20);


    text('maxSpeed: ' + round(e.maxSpeed, 2), 100, 30);
    text('maxForce: ' + round(e.maxForce, 2), 100, 40);
    text('direction: ' + round(e.dir, 2), 100, 50);
    text('energy: ' + round(e.energy, 2), 100, 60);
    text('mass: ' + round(e.mass, 2), 100, 70);
    text('metabolism: ' + round(e.meta, 6), 100, 80);
    

}

function mouseClicked() {
    console.log(mouseX, mouseY)
    mouse = createVector(mouseX, mouseY);
    
    stroke(255);
    fill(255, 0, 0, 50);
    ellipse(mouse.x, mouse.y, 100, 100)
    if (pack.foxes.length > 0){
        pack.foxes[0].turn = 0;
    }
    
}
