const nodemailer = require('nodemailer');
require('dotenv').config();

console.log("Config loaded:");
console.log("Host:", process.env.MAIL_HOST);
console.log("Port:", process.env.MAIL_PORT);
console.log("User:", process.env.MAIL_USER);
console.log("Pass:", process.env.MAIL_PASS ? "****" : "missing");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log("Verifying transporter connection...");
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server error:", error);
    process.exit(1);
  } else {
    console.log("✅ Mail server is ready!");
    process.exit(0);
  }
});
