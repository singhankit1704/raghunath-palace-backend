import express from "express"
import admin from "../middleware/admin.js"

import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  updateRoomPrice,
  deleteRoom
} from "../controllers/adminRoom.controller.js"

const router = express.Router()

router.post("/rooms", admin, createRoom)
router.get("/rooms", admin, getAllRooms)
router.get("/rooms/:id", admin, getRoomById)
router.put("/rooms/:id", admin, updateRoom)
router.put("/rooms/:id/price", admin, updateRoomPrice)
router.delete("/rooms/:id", admin, deleteRoom)

export default router
