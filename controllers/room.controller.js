import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        id: "asc"
      }
    })

    res.status(200).json({
      count: rooms.length,
      rooms
    })

  } catch (error) {
    console.error("getRooms error:", error)

    res.status(500).json({
      error: "Failed to fetch rooms"
    })
  }
}


// Get single room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params

    const room = await prisma.room.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!room) {
      return res.status(404).json({
        error: "Room not found"
      })
    }

    res.status(200).json(room)

  } catch (error) {
    console.error("getRoomById error:", error)

    res.status(500).json({
      error: "Failed to fetch room"
    })
  }
}


// Check room availability
export const availability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        error: "checkIn and checkOut dates required"
      })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        error: "Invalid date range"
      })
    }

    // Find available rooms
    const rooms = await prisma.room.findMany({
      where: {
        bookings: {
          none: {
            AND: [
              {
                checkIn: {
                  lte: checkOutDate
                }
              },
              {
                checkOut: {
                  gte: checkInDate
                }
              }
            ]
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    })

    res.status(200).json({
      availableCount: rooms.length,
      rooms
    })

  } catch (error) {
    console.error("availability error:", error)

    res.status(500).json({
      error: "Failed to check availability"
    })
  }
}
