import jwt from "jsonwebtoken"

export default function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization

    if (!header) {
      return res.status(401).json({
        error: "No token provided"
      })
    }

    const token = header.split(" ")[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    if (!decoded.isAdmin) {
      return res.status(403).json({
        error: "Admin access required"
      })
    }

    req.user = decoded

    next()

  } catch (error) {
    console.error("adminAuth error:", error)

    res.status(401).json({
      error: "Invalid or expired token"
    })
  }
}
