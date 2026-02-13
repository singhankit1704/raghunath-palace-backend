import { transporter } from "../config/mail.js"

export async function sendBookingEmail(to, invoicePath) {
  await transporter.sendMail({
    from: `"Raghunath Palace" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Booking Confirmed – Raghunath Palace",
    html: `
      <h2>Your stay is confirmed!</h2>
      <p>Thank you for booking with Raghunath Palace, Dashashwamedh Ghat.</p>
      <p>Find your invoice attached.</p>
    `,
    attachments:[
      { filename:"invoice.pdf", path:invoicePath }
    ]
  })
}
