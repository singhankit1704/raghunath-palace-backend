import Razorpay from "razorpay"
import crypto from "crypto"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})


// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body

    if (!bookingId) {
      return res.status(400).json({
        error: "Booking ID required"
      })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    })

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      })
    }

    if (booking.paid) {
      return res.status(400).json({
        error: "Booking already paid"
      })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: booking.totalPrice * 100, // paise
      currency: "INR",
      receipt: `booking_${booking.id}`,
      notes: {
        bookingId: booking.id
      }
    })

    res.status(200).json({
      message: "Order created",
      order
    })

  } catch (error) {
    console.error("createOrder error:", error)

    res.status(500).json({
      error: "Failed to create payment order"
    })
  }
}


// Verify payment signature and mark booking paid
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: "Missing payment verification data"
      })
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex")

    // Compare signatures
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: "Invalid payment signature"
      })
    }

    // Extract bookingId from receipt
    const order = await razorpay.orders.fetch(razorpay_order_id)

    const bookingId = order.notes.bookingId

    // Update booking status
    const booking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: {
        paid: true,
        paymentId: razorpay_payment_id
      }
    })

    res.status(200).json({
      message: "Payment verified successfully",
      booking
    })

  } catch (error) {
    console.error("verifyPayment error:", error)

    res.status(500).json({
      error: "Payment verification failed"
    })
  }
}
