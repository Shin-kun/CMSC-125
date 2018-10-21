
class User {
	constructor(id) {
		this.id = id;
		this.time = Math.floor((Math.random() * 5)) + 1;
    }
    
    decrementTime() {
        this.time--;
    }
}
