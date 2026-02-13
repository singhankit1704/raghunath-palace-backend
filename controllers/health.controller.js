import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Basic health check
export const health = async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: "OK",
      service: "Raghunath Palace API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // seconds
      environment: process.env.NODE_ENV || "development",
      database: "connected"
    })

  } catch (error) {
    console.error("Health check failed:", error)

    res.status(500).json({
      status: "ERROR",
      service: "Raghunath Palace API",
      timestamp: new Date().toISOString(),
      database: "disconnected"
    })
  }
}
