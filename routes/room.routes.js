import express from "express"

import {
  getRooms,
  getRoomById,
  availability
} from "../controllers/room.controller.js"

const router = express.Router()

router.get("/", getRooms)
router.get("/availability", availability)
router.get("/:id", getRoomById)

export default router
