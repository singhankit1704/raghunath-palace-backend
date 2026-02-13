import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Get all bookings (Admin)
export const allBookings = async (req, res) => {
  try {
    const data = await prisma.booking.findMany({
      include: {
        room: true,
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json(data)

  } catch (error) {
    console.error("Admin allBookings error:", error)
    res.status(500).json({
      error: "Failed to fetch bookings"
    })
  }
}


// Get total revenue (Admin)
export const revenue = async (req, res) => {
  try {
    const result = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        paid: true
      }
    })

    res.status(200).json({
      revenue: result._sum.totalPrice || 0
    })

  } catch (error) {
    console.error("Admin revenue error:", error)
    res.status(500).json({
      error: "Failed to calculate revenue"
    })
  }
}
