"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slotController_1 = require("../controllers/slotController");
const router = (0, express_1.Router)();
// Public route to calculate scheduling slots dynamically
router.get('/public', slotController_1.SlotController.getAvailableSlots);
exports.default = router;
