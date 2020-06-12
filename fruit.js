class Fruit {
     constructor(x, y, mass,id) {
         this.pos = createVector(x,y);
         this.mass = mass;
         this.massMAX = this.mass*2;
         this.r = this.mass*2;
         this.id = id;
         this.colorMod = random(0.7,1.5);
     }
    run(){
        this.mass += 0.01;//photosythesis
        if(this.mass > this.massMAX){
            this.reproduce();
        }
            
        this.render();
    }
    reproduce(){
        let ranx = random(-50,50);
        let rany = random(-50,50);
        
        let newFruit = new Fruit(this.pos.x + ranx, this.pos.y + rany, this.mass/2, foilage.fruits.length+1 )
        
        this.mass = this.mass/2;
        foilage.add(newFruit)
    }
    render(){
        this.r = this.mass*2;
        stroke(20);
        fill(70 * this.colorMod, 200 * this.colorMod, 150 * this.colorMod);
        ellipse(this.pos.x, this.pos.y, this.r);

        
        
    }
}