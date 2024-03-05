const Tutor = require("../models/tutor");
const Pet = require("../models/pet");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display all tutors
exports.tutor_list = asyncHandler(async (req, res, next) => {
  // res.send("Não implementado: lista de tutores");
  const allTutors = await Tutor.find({ deleted: null })
    .sort({ name: 1 })
    .exec();

  res.render("tutor_list", {
    title: "Lista de tutores",
    tutors: allTutors,
  });
});

// Display specific tutor
exports.tutor_detail = asyncHandler(async (req, res, next) => {
  const [tutor, allPetsByTutor] = await Promise.all([
    Tutor.findById(req.params.id).exec(),
    Pet.find({ tutor: req.params.id, deleted: null }).exec(),
  ]);

  if (tutor === null) {
    const err = new Error("Tutor não encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("tutor_detail", {
    title: tutor.name,
    tutor: tutor,
    pets: allPetsByTutor,
  });
});

// Create tutor get
exports.tutor_create_get = asyncHandler(async (req, res, next) => {
  res.render("tutor_form", {
    title: "Cadastrar novo tutor",
  });
});

// Create tutor post
exports.tutor_create_post = [
  body("name", "Nome não pode estar vazio")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("phone")
    .trim()
    .matches(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/)
    .withMessage("Telefone inválido.")
    .escape(),
  body("email").trim().isEmail().escape(),
  body("address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Endereço muito curto")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const tutor = new Tutor({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    });

    if (!errors.isEmpty()) {
      res.render("tutor_form", {
        title: "Cadastrar novo tutor",
        tutor: tutor,
        errors: errors.array(),
      });
    } else {
      await tutor.save();
      res.redirect(tutor.url);
    }
  }),
];

// Delete tutor get
exports.tutor_delete_get = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id).exec();
  const allPetsByTutor = await Pet.find({ tutor: req.params.id });

  if (tutor === null || tutor.deleted !== null)
    res.redirect("/registry/tutors");

  res.render("tutor_delete", {
    title: "Remover tutor",
    tutor: tutor,
    pets: allPetsByTutor,
  });
});

// Delete tutor post
exports.tutor_delete_post = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id);
  const allPetsByTutor = await Pet.find({ tutor: req.params.id });

  if (tutor === null) {
    const err = new Error("Tutor não encontrado");
    err.status = 404;
    return next(err);
  }

  if (req.body.password !== process.env.MODIFY_KEY) {
    return res.render("tutor_delete", {
      title: "Remover tutor",
      tutor: tutor,
      pets: allPetsByTutor,
      error: "Senha incorreta",
    });
  }

  //delete all associated pets (soft)
  await Promise.all(
    allPetsByTutor.map((pet) => {
      pet.deleted = new Date();
      return pet.save();
    })
  );

  tutor.deleted = new Date();
  await tutor.save();

  res.redirect("/registry/tutors");
});

// Update tutor get
exports.tutor_update_get = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id).exec();

  if (tutor === null) {
    const err = new Error("Tutor não encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("tutor_form", {
    title: "Modificar tutor",
    tutor: tutor,
    update: true,
  });
});

// Update tutor post
exports.tutor_update_post = [
  body("name", "Nome não pode estar vazio")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("phone")
    .trim()
    .matches(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/)
    .withMessage("Telefone inválido.")
    .escape(),
  body("email").trim().isEmail().escape(),
  body("address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Endereço muito curto")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const tutor = new Tutor({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      _id: req.params.id,
    });

    if (req.body.password !== process.env.MODIFY_KEY) {
      res.render("tutor_form", {
        title: "Modificar tutor",
        tutor: tutor,
        update: true,
        errors: [{ msg: "Senha incorreta" }],
      });
    }

    if (!errors.isEmpty()) {
      res.render("tutor_form", {
        title: "Modificar tutor",
        tutor: tutor,
        errors: errors.array(),
      });
    } else {
      await Tutor.findByIdAndUpdate(req.params.id, tutor, {});
      res.redirect(tutor.url);
    }
  }),
];
