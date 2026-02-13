import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Room occupancy statistics
export const occupancy = async (req, res) => {
  try {
    const totalRooms = await prisma.room.count()

    const bookedRooms = await prisma.booking.count({
      where: {
        paid: true
      }
    })

    const occupancyRate =
      totalRooms === 0 ? 0 : ((bookedRooms / totalRooms) * 100).toFixed(2)

    res.status(200).json({
      totalRooms,
      bookedRooms,
      occupancyRate: Number(occupancyRate)
    })

  } catch (error) {
    console.error("occupancy error:", error)
    res.status(500).json({
      error: "Failed to fetch occupancy data"
    })
  }
}


// Total revenue analytics
export const totalRevenue = async (req, res) => {
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
      totalRevenue: result._sum.totalPrice || 0
    })

  } catch (error) {
    console.error("totalRevenue error:", error)
    res.status(500).json({
      error: "Failed to fetch revenue"
    })
  }
}


// Total bookings count
export const totalBookings = async (req, res) => {
  try {
    const count = await prisma.booking.count()

    res.status(200).json({
      totalBookings: count
    })

  } catch (error) {
    console.error("totalBookings error:", error)
    res.status(500).json({
      error: "Failed to fetch booking count"
    })
  }
}


// Total users count
export const totalUsers = async (req, res) => {
  try {
    const count = await prisma.user.count()

    res.status(200).json({
      totalUsers: count
    })

  } catch (error) {
    console.error("totalUsers error:", error)
    res.status(500).json({
      error: "Failed to fetch user count"
    })
  }
}


// Admin dashboard summary
export const dashboardStats = async (req, res) => {
  try {
    const totalRooms = await prisma.room.count()

    const totalBookings = await prisma.booking.count()

    const totalUsers = await prisma.user.count()

    const revenueResult = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        paid: true
      }
    })

    const totalRevenue = revenueResult._sum.totalPrice || 0

    res.status(200).json({
      totalRooms,
      totalBookings,
      totalUsers,
      totalRevenue
    })

  } catch (error) {
    console.error("dashboardStats error:", error)
    res.status(500).json({
      error: "Failed to fetch dashboard stats"
    })
  }
}
