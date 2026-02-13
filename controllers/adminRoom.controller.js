import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Create new room
export const createRoom = async (req, res) => {
  try {
    const { name, bedType, price, view, ac, bathroom, images } = req.body

    if (!name || !price)
      return res.status(400).json({ error: "Name and price are required" })

    const room = await prisma.room.create({
      data: {
        name,
        bedType,
        price: Number(price),
        view,
        ac,
        bathroom,
        images
      }
    })

    res.status(201).json({
      message: "Room created successfully",
      room
    })

  } catch (error) {
    console.error("createRoom error:", error)
    res.status(500).json({ error: "Failed to create room" })
  }
}


// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { id: "asc" }
    })

    res.status(200).json(rooms)

  } catch (error) {
    console.error("getAllRooms error:", error)
    res.status(500).json({ error: "Failed to fetch rooms" })
  }
}


// Get single room
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params

    const room = await prisma.room.findUnique({
      where: { id: Number(id) }
    })

    if (!room)
      return res.status(404).json({ error: "Room not found" })

    res.status(200).json(room)

  } catch (error) {
    console.error("getRoomById error:", error)
    res.status(500).json({ error: "Failed to fetch room" })
  }
}


// Update room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params

    const room = await prisma.room.update({
      where: { id: Number(id) },
      data: req.body
    })

    res.status(200).json({
      message: "Room updated successfully",
      room
    })

  } catch (error) {
    console.error("updateRoom error:", error)
    res.status(404).json({ error: "Room not found" })
  }
}


// Update room price only
export const updateRoomPrice = async (req, res) => {
  try {
    const { id } = req.params
    const { price } = req.body

    if (!price)
      return res.status(400).json({ error: "Price required" })

    const room = await prisma.room.update({
      where: { id: Number(id) },
      data: { price: Number(price) }
    })

    res.status(200).json({
      message: "Room price updated",
      room
    })

  } catch (error) {
    console.error("updateRoomPrice error:", error)
    res.status(404).json({ error: "Room not found" })
  }
}


// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.room.delete({
      where: { id: Number(id) }
    })

    res.status(200).json({
      message: "Room deleted successfully"
    })

  } catch (error) {
    console.error("deleteRoom error:", error)
    res.status(404).json({ error: "Room not found" })
  }
}
