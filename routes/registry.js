const express = require("express");
const router = express.Router();

const petController = require("../controllers/petController");
const tutorController = require("../controllers/tutorController");

// INDEX
router.get("/", petController.index);

// PET ROUTES

// All pets
router.get("/pets", petController.pet_list);

// Create pet get
router.get("/pet/create", petController.pet_create_get);

// Create pet get
router.post("/pet/create", petController.pet_create_post);

// Pet detail
router.get("/pet/:id", petController.pet_detail);

// Delete pet get
router.get("/pet/:id/delete", petController.pet_delete_get);

// Delete pet post
router.post("/pet/:id/delete", petController.pet_delete_post);

// Update pet get
router.get("/pet/:id/update", petController.pet_update_get);

// Update pet post
router.post("/pet/:id/update", petController.pet_update_post);

// TUTOR ROUTES

// All tutors
router.get("/tutors", tutorController.tutor_list);

// Create tutor get
router.get("/tutor/create", tutorController.tutor_create_get);

// Create tutor get
router.post("/tutor/create", tutorController.tutor_create_post);

// Tutor detail
router.get("/tutor/:id", tutorController.tutor_detail);

// Delete tutor get
router.get("/tutor/:id/delete", tutorController.tutor_delete_get);

// Delete tutor post
router.post("/tutor/:id/delete", tutorController.tutor_delete_post);

// Update tutor get
router.get("/tutor/:id/update", tutorController.tutor_update_get);

// Update tutor post
router.post("/tutor/:id/update", tutorController.tutor_update_post);

module.exports = router;
