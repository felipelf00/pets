const Pet = require("../models/pet");
const Tutor = require("../models/tutor");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Index
exports.index = asyncHandler(async (req, res, next) => {
  const [countPets, countTutors] = await Promise.all([
    Pet.countDocuments({ deleted: null }).exec(),
    Tutor.countDocuments({ deleted: null }).exec(),
  ]);

  res.render("index", {
    title: "Cadastro Pet",
    petCount: countPets,
    tutorCount: countTutors,
  });
});

// Display all pets
exports.pet_list = asyncHandler(async (req, res, next) => {
  const allPets = await Pet.find({ deleted: null }).sort({ name: 1 }).exec();

  res.render("pet_list", {
    title: "Lista de pets",
    pets: allPets,
  });
});

// Display specific pet
exports.pet_detail = asyncHandler(async (req, res, next) => {
  // res.send(`Não implementado: detalhe pet: ${req.params.id}`);
  const pet = await Pet.findById(req.params.id).populate("tutor").exec();

  if (pet === null) {
    const err = new Error("Pet não encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("pet_detail", {
    title: pet.name,
    pet: pet,
  });
});

// Create pet get
exports.pet_create_get = asyncHandler(async (req, res, next) => {
  const allTutors = await Tutor.find({ deleted: null })
    .sort({ name: 1 })
    .exec();

  res.render("pet_form", {
    title: "Cadastrar novo pet",
    tutors: allTutors,
  });
});

// Create pet post
exports.pet_create_post = [
  body("name", "Nome não pode estar vazio")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("species", "Espécie deve ter ao menos 3 caracteres")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("description").optional({ checkFalsy: true }).trim().escape(),
  body("weight")
    .optional({ checkFalsy: true })
    .trim()
    .custom((value, { req }) => {
      if (value) {
        const valueWithDot = value.replace(",", ".");
        if (!isNaN(parseFloat(valueWithDot))) {
          req.body.weight = parseFloat(valueWithDot);
          return true;
        }
      }
      throw new Error("O peso deve ser um número");
    }),
  body("sex")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["macho", "fêmea"])
    .withMessage('Sexo deve ser "macho" ou "fêmea"'),
  body("date_of_birth", "Data inválida")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("tutor").optional({ checkFalsy: true }).trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (req.body.sex === "") req.body.sex = null;
    if (req.body.tutor === "") req.body.tutor = null;

    const pet = new Pet({
      name: req.body.name,
      species: req.body.species,
      description: req.body.description,
      weight: req.body.weight,
      sex: req.body.sex,
      date_of_birth: req.body.date_of_birth,
      tutor: req.body.tutor,
    });

    if (!errors.isEmpty()) {
      const allTutors = Tutor.find().sort({ name: 1 }).exec();

      res.render("pet_form", {
        title: "Cadastrar novo pet",
        pet: pet,
        tutors: allTutors,
        errors: errors.array(),
      });
    } else {
      await pet.save();
      res.redirect(pet.url);
    }
  }),
];

// Delete pet get
exports.pet_delete_get = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);

  if (pet === null) res.redirect("/registry/pets");

  console.log("Id: " + req.params.id);
  console.log("Pet enviado por get: " + pet.name);

  res.render("pet_delete", {
    title: `Remover pet`,
    pet: pet,
  });
});

// Delete pet post
exports.pet_delete_post = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);

  if (pet === null) {
    const err = new Error("Pet não encontrado");
    err.status = 404;
    return next(err);
  }

  if (req.body.password !== process.env.MODIFY_KEY) {
    return res.render("pet_delete", {
      title: "Remover pet",
      pet: pet,
      error: "Senha incorreta",
    });
  }

  pet.deleted = new Date();
  await pet.save();
  res.redirect("/registry/pets");
});

// Update pet get
exports.pet_update_get = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: modificar (get)");
});

// Update pet post
exports.pet_update_post = asyncHandler(async (req, res, next) => {
  res.send("Não implementado: modificar (post)");
});
