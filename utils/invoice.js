import PDFDocument from "pdfkit"
import fs from "fs"

export function generateInvoice(booking, room) {
  const doc = new PDFDocument()
  const filePath = `invoices/invoice-${booking.id}.pdf`
  doc.pipe(fs.createWriteStream(filePath))

  doc.fontSize(20).text("Raghunath Palace", { align:"center" })
  doc.text("Dashashwamedh Ghat, Varanasi")
  doc.moveDown()

  doc.text(`Invoice #: ${booking.id}`)
  doc.text(`Guest: ${booking.guestName}`)
  doc.text(`Room: ${room.name}`)
  doc.text(`Check-in: ${booking.checkIn}`)
  doc.text(`Check-out: ${booking.checkOut}`)
  doc.text(`Total: ₹${booking.totalPrice}`)
  doc.text("Payment Status: PAID")

  doc.end()
  return filePath
}
