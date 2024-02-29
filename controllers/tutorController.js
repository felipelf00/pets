const Tutor = require("../models/tutor");
const Pet = require("../models/pet");
const asyncHandler = require("express-async-handler");

// Display all tutors
exports.tutor_list = asyncHandler(async (req, res, next) => {
  // res.send("Não implementado: lista de tutores");
  const allTutors = await Tutor.find().sort({ name: 1 }).exec();

  res.render("tutor_list", {
    title: "Lista de tutores",
    tutors: allTutors,
  });
});

// Display specific tutor
exports.tutor_detail = asyncHandler(async (req, res, next) => {
  const [tutor, allPetsByTutor] = await Promise.all([
    Tutor.findById(req.params.id).exec(),
    Pet.find({ tutor: req.params.id }).exec(),
  ]);

  if (tutor === null) {
    const err = new Error("Tutor não encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("tutor_detail", {
    title: tutor.name,
    tutor: tutor,
  });
});

// Create tutor get
exports.tutor_create_get = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: criar (get)");
});

// Create tutor post
exports.tutor_create_post = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: criar (post)");
});

// Delete tutor get
exports.tutor_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: excluir (get)");
});

// Delete tutor post
exports.tutor_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: excluir (post)");
});

// Update tutor get
exports.tutor_update_get = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: modificar (get)");
});

// Update tutor post
exports.tutor_update_post = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: modificar (post)");
});
