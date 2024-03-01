#! /usr/bin/env node

console.log(
  'This script populates some test pets and tutors bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Pet = require("./models/pet");
const Tutor = require("./models/tutor");

const pets = [];
const tutors = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createTutors();
  await createPets();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function petCreate(
  index,
  name,
  species,
  description,
  weight,
  sex,
  date_of_birth,
  tutor
) {
  const petdetail = {
    name: name,
    species: species,
    description: description,
    weight: weight,
    sex: sex,
    date_of_birth: date_of_birth,
    tutor: tutor,
  };

  const pet = new Pet(petdetail);

  await pet.save();
  pets[index] = pet;
  console.log(`Added pet: ${name}`);
}

async function tutorCreate(index, name, phone, email, address) {
  const tutordetail = {
    name: name,
    phone: phone,
    email: email,
    address: address,
  };

  const tutor = new Tutor(tutordetail);

  await tutor.save();
  tutors[index] = tutor;
  console.log(`Added tutor ${name}`);
  console.log("Tutors array: " + tutors);
}

async function createTutors() {
  console.log("Adding tutors");
  await Promise.all([
    tutorCreate(
      0,
      "Nayara",
      "41 912345678",
      "nayzinhar0ck@hotmail.com",
      "Rua Carlos Federico 123"
    ),
    tutorCreate(
      1,
      "Felipe",
      "167869420",
      "paidasabina@gmail.com",
      "Rua Carlos Frederico 123"
    ),
    tutorCreate(
      2,
      "Andrea",
      "123456",
      "andrea@terra.com.br",
      "Rua Oscarito 123"
    ),
    tutorCreate(
      3,
      "Barbara",
      "999999",
      "sou_hacker@yahoo.com",
      "Rua das Pitangueiras 321"
    ),
  ]);
}

async function createPets() {
  console.log("Adding pets");
  await Promise.all([
    petCreate(
      0,
      "Bituca",
      "Gato",
      "Branco, fofo e bandidinho",
      5,
      "macho",
      "2017-05-16",
      tutors[0]
    ),
    petCreate(
      1,
      "Sabina",
      "Gato",
      "Preta, bela e terrível",
      4,
      "fêmea",
      "2017-08-25",
      tutors[1]
    ),
    petCreate(
      2,
      "Sheila Carvalho",
      "Cão",
      "Preta e branca e esquisitona",
      38,
      "fêmea",
      "2008-07-01",
      tutors[2]
    ),
    petCreate(
      2,
      "Frederico",
      "Gato",
      "Laranja, não sabe os conceitos básicos",
      6,
      "macho",
      "2016-09-28",
      tutors[3]
    ),
    petCreate(
      2,
      "Josefina",
      "Gato",
      "Siamesa, miado e perna fina",
      4,
      "fêmea",
      "2015-04-01",
      tutors[3]
    ),
  ]);
}
