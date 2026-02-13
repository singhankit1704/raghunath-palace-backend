import express from "express"
import admin from "../middleware/admin.js"

import {
  occupancy,
  totalRevenue,
  totalBookings,
  totalUsers,
  dashboardStats
} from "../controllers/analytics.controller.js"

const router = express.Router()

router.get("/occupancy", admin, occupancy)
router.get("/revenue", admin, totalRevenue)
router.get("/bookings", admin, totalBookings)
router.get("/users", admin, totalUsers)
router.get("/dashboard", admin, dashboardStats)

export default router
