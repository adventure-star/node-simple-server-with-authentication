
const { User } = require("./models/user");
const mongoose = require("mongoose");
const config = require("config");
const crypto = require("crypto");

const password = crypto.createHash('sha256', "JackJack")                      
                            .update('How are you?') 
                            .digest('hex'); 
console.log(password);

const data = [

  {
    name: "Andrei",
    email:"Andrei@ro.com", 
    password:"df287dfc1406ed2b692e1c2c783bb5cec97eac53151ee1d9810397aa0afa0d89",
    permission:"",
    role:"admin"
  },
  {
    name: "JackJack",
    email:"JackJack@ro.com", 
    password:password,
    permission:"",
    role:"user"
  }
  
];

async function seed() {

  await mongoose.connect(config.get("db"));

  await User.deleteMany({});

  // for (let genre of data) {
  //   const { _id: genreId } = await new Genre({ name: genre.name }).save();
  //   const movies = genre.movies.map(movie => ({
  //     ...movie,
  //     genre: { _id: genreId, name: genre.name }
  //   }));
  //   await Movie.insertMany(movies);
  // }

  for ( let user of data ) {

    console.log(user);

    await new User({
       name: user.name, 
       email: user.email, 
       password: user.password,
       permission:user.permission,
       role:user.role
      }).save();

  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
