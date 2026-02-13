import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body
    const userId = req.user.userId

    // Validate input
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        error: "Room, check-in and check-out required"
      })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        error: "Invalid date range"
      })
    }

    // Check room exists
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) }
    })

    if (!room) {
      return res.status(404).json({
        error: "Room not found"
      })
    }

    // Check availability (prevent double booking)
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: Number(roomId),
        AND: [
          {
            checkIn: { lte: checkOutDate }
          },
          {
            checkOut: { gte: checkInDate }
          }
        ]
      }
    })

    if (conflict) {
      return res.status(400).json({
        error: "Room not available for selected dates"
      })
    }

    // Calculate days
    const days = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    )

    const totalPrice = days * room.price

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId: Number(roomId),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        paid: false
      }
    })

    res.status(201).json({
      message: "Booking created successfully",
      booking
    })

  } catch (error) {
    console.error("createBooking error:", error)

    res.status(500).json({
      error: "Failed to create booking"
    })
  }
}


// Cancel booking (user can cancel own booking)
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id)
    const userId = req.user.userId

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      })
    }

    // Only owner or admin can cancel
    if (booking.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        error: "Unauthorized"
      })
    }

    await prisma.booking.delete({
      where: { id: bookingId }
    })

    res.status(200).json({
      message: "Booking cancelled successfully"
    })

  } catch (error) {
    console.error("cancelBooking error:", error)

    res.status(500).json({
      error: "Failed to cancel booking"
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

    res.status(200).json(bookings)

  } catch (error) {
    console.error("getMyBookings error:", error)

    res.status(500).json({
      error: "Failed to fetch bookings"
    })
  }
}


// Get single booking
export const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: Number(req.params.id)
      },
      include: {
        room: true,
        user: true
      }
    })

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      })
    }

    res.status(200).json(booking)

  } catch (error) {
    console.error("getBookingById error:", error)

    res.status(500).json({
      error: "Failed to fetch booking"
    })
  }
}
