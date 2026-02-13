import jwt from "jsonwebtoken"


export default function auth(req, res, next) {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization

    // Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied. No token provided"
      })
    }

    // Extract token (Bearer token)
    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        error: "Invalid token format"
      })
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Attach user data to request
    req.user = decoded

    next()

  } catch (error) {
    console.error("Auth middleware error:", error)

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired"
      })
    }

    res.status(401).json({
      error: "Invalid token"
    })
  }
}
