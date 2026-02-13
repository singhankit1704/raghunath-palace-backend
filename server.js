import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Route imports
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import roomRoutes from "./routes/room.routes.js"
import bookingRoutes from "./routes/booking.routes.js"
import paymentRoutes from "./routes/payment.routes.js"

import adminRoutes from "./routes/admin.routes.js"
import adminBookingRoutes from "./routes/adminBookings.routes.js"
import adminRoomRoutes from "./routes/adminRoom.routes.js"

import analyticsRoutes from "./routes/analytics.routes.js"
import healthRoutes from "./routes/health.routes.js"


dotenv.config()

const app = express()


// Middlewares
app.use(cors())
app.use(express.json())


// Public routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/payment", paymentRoutes)


// Admin routes
app.use("/api/admin", adminRoutes)
app.use("/api/admin", adminBookingRoutes)
app.use("/api/admin", adminRoomRoutes)


// Analytics routes
app.use("/api/analytics", analyticsRoutes)


// Health check route
app.use("/api/health", healthRoutes)


// Root test route
app.get("/", (req, res) => {
  res.json({
    message: "Raghunath Palace API running"
  })
})


// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
