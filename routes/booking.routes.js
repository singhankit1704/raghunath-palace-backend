import express from "express"

import {
  createBooking,
  cancelBooking,
  getMyBookings,
  getBookingById
} from "../controllers/booking.controller.js"

import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/", auth, createBooking)
router.delete("/:id", auth, cancelBooking)
router.get("/my", auth, getMyBookings)
router.get("/:id", auth, getBookingById)

export default router
