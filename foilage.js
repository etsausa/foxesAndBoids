class Foilage {
    constructor() {
        this.fruits = [];
        this.index = 0;
    }

    run() {
        if(this.fruits.length < 10) {
            this.create(random(1,5));
        }
        for (let i = 0; i < this.fruits.length; i++) {
            if(this.fruits[i] != null){
                this.fruits[i].run();
            }
        }
    }
    add(f) {
        if(this.fruits.length < 500){
            this.fruits.push(f);   
        }
        
    }

    remove(id) {

        for (let i = this.fruits.length - 1; i >= 0; i--) { //check all 
            if (this.fruits[i].id === id) { //if current fruit matches id
                this.fruits.splice(i, 1); //remove from list
                console.log("Plant " + id + " removed");
            }
        }

    }

    create(amount) {
        for (let i = 0; i < amount; i++) {
            const x = random(50, width-50);
            const y = random(50, height-50);
            const m = random(1, 3);
            this.add(new Fruit(x, y, m, this.index));
            this.index++;
        }

    }

}
