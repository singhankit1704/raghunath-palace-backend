import express from "express"

import {
  getProfile,
  updateProfile,
  getMyBookings,
  getMyBookingById
} from "../controllers/user.controller.js"

import auth from "../middleware/auth.js"

const router = express.Router()

router.get("/profile", auth, getProfile)
router.put("/profile", auth, updateProfile)
router.get("/bookings", auth, getMyBookings)
router.get("/bookings/:id", auth, getMyBookingById)

export default router
