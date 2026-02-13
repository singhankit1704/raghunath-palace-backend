import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Get all bookings (latest first)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: true,
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json(bookings)

  } catch (error) {
    console.error("getAllBookings error:", error)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
}


// Get single booking
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        room: true,
        user: true
      }
    })

    if (!booking)
      return res.status(404).json({ error: "Booking not found" })

    res.status(200).json(booking)

  } catch (error) {
    console.error("getBookingById error:", error)
    res.status(500).json({ error: "Failed to fetch booking" })
  }
}


// Get paid bookings
export const getPaidBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { paid: true },
      include: {
        room: true,
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json(bookings)

  } catch (error) {
    console.error("getPaidBookings error:", error)
    res.status(500).json({ error: "Failed to fetch paid bookings" })
  }
}


// Get unpaid bookings
export const getUnpaidBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { paid: false },
      include: {
        room: true,
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json(bookings)

  } catch (error) {
    console.error("getUnpaidBookings error:", error)
    res.status(500).json({ error: "Failed to fetch unpaid bookings" })
  }
}


// Update payment status
export const updateBookingPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { paid } = req.body

    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { paid }
    })

    res.status(200).json({
      message: "Booking payment status updated",
      booking
    })

  } catch (error) {
    console.error("updateBookingPaymentStatus error:", error)
    res.status(500).json({ error: "Failed to update booking" })
  }
}


// Cancel / Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.booking.delete({
      where: { id: Number(id) }
    })

    res.status(200).json({
      message: "Booking cancelled successfully"
    })

  } catch (error) {
    console.error("deleteBooking error:", error)
    res.status(500).json({ error: "Failed to delete booking" })
  }
}


// Filter bookings by date range
export const getBookingsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        room: true,
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json(bookings)

  } catch (error) {
    console.error("getBookingsByDate error:", error)
    res.status(500).json({ error: "Failed to filter bookings" })
  }
}
