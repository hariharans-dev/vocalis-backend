import nodemailer from "nodemailer";

async function sendEmail(recipient, subject, link) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.MAIL_SENDER,
    to: recipient,
    subject: subject,
    html: `
    <h2>📧✨ Hello! ✨📧</h2>
    <p>This is a Forgetpassword mail!!! . 🚀💻</p>
    <p>Hope you have a great day! 😊🎉</p>
    <a href="${link}" target="_blank">Click Here</a>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export { sendEmail };
