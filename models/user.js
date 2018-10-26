class User{
    constructor(object){
        // id and date is optional for the constructor. 
        // this is to facilitate new user creation (id should be incremented by the db)
        // and date will be created if there is none for new users

        this.id = object.id? object.id : null;
        this.name = object.name;
        this.email = object.email;
        this.points = object.points ? object.points: 0;
    }
}

module.exports = User;