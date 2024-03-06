const Pet = require("../models/pet");
const Tutor = require("../models/tutor");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

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

  if (pet.date_of_birth) {
    pet.date_of_birth = DateTime.fromJSDate(pet.date_of_birth);
  }

  let weight = null;
  if (pet.weight) {
    weight = pet.weight.toString().replace(".", ",");
  }

  res.render("pet_detail", {
    title: pet.name,
    pet: pet,
    weight: weight,
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
    // .custom((value, { req }) => {
    //   if (value) {
    //     console.log("entered if");
    //     const valueWithDot = value.replace(",", ".");
    //     console.log("valueWithDot: " + valueWithDot);

    //     if (!isNaN(parseFloat(valueWithDot))) {
    //       req.body.weight = parseFloat(valueWithDot);
    //       console.log("parsed value: " + parseFloat(valueWithDot));
    //       console.log(
    //         "req.body value: " +
    //           req.body.weight +
    //           ", type: " +
    //           typeof req.body.weight
    //       );
    //     } else throw new Error("O peso deve ser um número");
    //   }
    // })
    .escape(),
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

  (req, res, next) => {
    if (req.body.weight) {
      // console.log("entered if");
      const valueWithDot = req.body.weight.replace(",", ".");
      // console.log("valueWithDot: " + valueWithDot);

      if (!isNaN(parseFloat(valueWithDot))) {
        req.body.weight = parseFloat(valueWithDot);
        // console.log("parsed value: " + parseFloat(valueWithDot));
        // console.log(
        //   "req.body value: " +
        //     req.body.weight +
        //     ", type: " +
        //     typeof req.body.weight
        // );
      } else throw new Error("O peso deve ser um número");
    }
    next();
  },

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (req.body.sex === "") req.body.sex = null;
    if (req.body.tutor === "") req.body.tutor = null;

    console.log(
      "peso: " + req.body.weight + ", type: " + typeof req.body.weight
    );

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
      const allTutors = await Tutor.find({ deleted: null })
        .sort({ name: 1 })
        .exec();

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
  const pet = await Pet.findById(req.params.id).exec();

  if (pet === null || pet.deleted !== null) res.redirect("/registry/pets");

  res.render("pet_delete", {
    title: "Remover pet",
    pet: pet,
  });
});

// Delete pet post
exports.pet_delete_post = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id).exec();

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
  const [pet, allTutors] = await Promise.all([
    Pet.findById(req.params.id).exec(),
    Tutor.find({ deleted: null }).sort({ name: 1 }).exec(),
  ]);

  if (pet === null) {
    const err = new Error("Pet não encontrado");
    err.status = 404;
    return next(err);
  }
  let formattedBirthDate = null;
  if (pet.date_of_birth) {
    formattedBirthDate = pet.date_of_birth.toISOString().split("T")[0];
  } else formattedBirthDate = null;

  res.render("pet_form", {
    title: "Modificar pet",
    tutors: allTutors,
    pet: pet,
    birthDate: formattedBirthDate,
    update: true,
  });
});

// Update pet post
exports.pet_update_post = [
  body("name", "Nome não pode estar vazio")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("species", "Espécie deve ter ao menos 3 caracteres")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("description").optional({ checkFalsy: true }).trim().escape(),
  body("weight").optional({ checkFalsy: true }).trim().escape(),
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

  (req, res, next) => {
    if (req.body.weight) {
      const valueWithDot = req.body.weight.replace(",", ".");

      if (!isNaN(parseFloat(valueWithDot))) {
        req.body.weight = parseFloat(valueWithDot);
      } else throw new Error("O peso deve ser um número");
    }
    next();
  },

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const pet = new Pet({
      name: req.body.name,
      species: req.body.species,
      description: req.body.description,
      weight: req.body.weight,
      sex: req.body.sex,
      date_of_birth: req.body.date_of_birth.toISOString().split("T")[0],
      tutor: req.body.tutor,
      _id: req.params.id,
    });

    if (req.body.password !== process.env.MODIFY_KEY) {
      const allTutors = await Tutor.find({ deleted: null })
        .sort({ name: 1 })
        .exec();
      res.render("pet_form", {
        title: "Modificar pet",
        tutors: allTutors,
        pet: pet,
        birthDate: pet.date_of_birth.toISOString().split("T")[0],
        update: true,
        errors: [{ msg: "Senha incorreta" }],
      });
    }

    if (!errors.isEmpty()) {
      const allTutors = await Tutor.find({ deleted: null })
        .sort({ name: 1 })
        .exec();

      res.render("pet_form", {
        title: "Modificar pet",
        pet: pet,
        tutors: allTutors,
        errors: errors.array(),
      });
    } else {
      await Pet.findByIdAndUpdate(req.params.id, pet, {});
      res.redirect(pet.url);
    }
  }),
];
