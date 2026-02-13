import express from "express"
import admin from "../middleware/admin.js"

import {
  getAllBookings,
  getBookingById,
  getPaidBookings,
  getUnpaidBookings,
  updateBookingPaymentStatus,
  deleteBooking,
  getBookingsByDate
} from "../controllers/adminBookings.controller.js"

const router = express.Router()

router.get("/bookings", admin, getAllBookings)
router.get("/bookings/:id", admin, getBookingById)
router.get("/bookings-paid", admin, getPaidBookings)
router.get("/bookings-unpaid", admin, getUnpaidBookings)
router.put("/bookings/:id/payment", admin, updateBookingPaymentStatus)
router.delete("/bookings/:id", admin, deleteBooking)
router.get("/bookings-filter", admin, getBookingsByDate)

export default router
