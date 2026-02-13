import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      })
    }

    // Check existing user
    const exists = await prisma.user.findUnique({
      where: { email }
    })

    if (exists) {
      return res.status(400).json({
        error: "Email already registered"
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        isAdmin: false
      }
    })

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id
    })

  } catch (error) {
    console.error("Register error:", error)

    res.status(500).json({
      error: "Registration failed"
    })
  }
}


// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required"
      })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    // Check password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    )

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    )

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    })

  } catch (error) {
    console.error("Login error:", error)

    res.status(500).json({
      error: "Login failed"
    })
  }
}


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
        isAdmin: true
      }
    })

    res.status(200).json(user)

  } catch (error) {
    console.error("Profile error:", error)

    res.status(500).json({
      error: "Failed to fetch profile"
    })
  }
}
