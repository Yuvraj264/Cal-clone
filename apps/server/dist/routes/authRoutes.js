"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authGuard_1 = require("../middlewares/authGuard");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
router.post('/logout', authController_1.AuthController.logout);
// Protected routes (require valid JWT)
router.get('/me', authGuard_1.authGuard, authController_1.AuthController.getMe);
exports.default = router;
