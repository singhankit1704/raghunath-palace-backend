import express from "express"
import admin from "../middleware/admin.js"

import {
  allBookings,
  revenue
} from "../controllers/admin.controller.js"

const router = express.Router()

router.get("/bookings", admin, allBookings)
router.get("/revenue", admin, revenue)

export default router
