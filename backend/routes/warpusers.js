// Bring in the express server
import express from "express";

// Bring in the Express Router
const router = express.Router();

// Import the Controller
const controller = require("../public/javascripts/controllers/warpusers");

// route
router.get('/', controller.findUser);
router.put('/', controller.updateUser);
router.post('/', controller.registerUser);
router.delete('/', controller.deleteUser);
router.get('/login', controller.loginUser);

module.exports = router;
