import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      })
    }

    res.status(200).json(user)

  } catch (error) {
    console.error("getProfile error:", error)

    res.status(500).json({
      error: "Failed to fetch profile"
    })
  }
}


// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId
      },
      data: {
        name,
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    })

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    })

  } catch (error) {
    console.error("updateProfile error:", error)

    res.status(500).json({
      error: "Failed to update profile"
    })
  }
}


// Get logged-in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.userId
      },
      include: {
        room: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json({
      count: bookings.length,
      bookings
    })

  } catch (error) {
    console.error("getMyBookings error:", error)

    res.status(500).json({
      error: "Failed to fetch bookings"
    })
  }
}


// Get single booking of user
export const getMyBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.userId
      },
      include: {
        room: true
      }
    })

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      })
    }

    res.status(200).json(booking)

  } catch (error) {
    console.error("getMyBookingById error:", error)

    res.status(500).json({
      error: "Failed to fetch booking"
    })
  }
}
