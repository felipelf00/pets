const Pet = require("../models/pet");
const Tutor = require("../models/tutor");
const asyncHandler = require("express-async-handler");

// Index
exports.index = asyncHandler(async (req, res, next) => {
  const [countPets, countTutors] = await Promise.all([
    Pet.countDocuments({}).exec(),
    Tutor.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Cadastro Pet",
    petCount: countPets,
    tutorCount: countTutors,
  });
});

// Display all pets
exports.pet_list = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: lista de pets");
});

// Display specific pet
exports.pet_detail = asyncHandler(async (req, res, next) => {
  res.send(`Não implementado: detalhe pet: ${req.params.id}`);
});

// Create pet get
exports.pet_create_get = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: criar (get)");
});

// Create pet post
exports.pet_create_post = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: criar (post)");
});

// Delete pet get
exports.pet_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: excluir (get)");
});

// Delete pet post
exports.pet_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: excluir (post)");
});

// Update pet get
exports.pet_update_get = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: modificar (get)");
});

// Update pet post
exports.pet_update_post = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: modificar (post)");
});
