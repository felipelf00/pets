const Tutor = require("../models/tutor");
const asyncHandler = require("express-async-handler");

// Display all tutors
exports.tutor_list = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: lista de tutores");
});

// Display specific tutor
exports.tutor_detail = asyncHandler(async (req, res, next) => {
  res.send(`Não implementado: detalhe tutor: ${req.params.id}`);
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
