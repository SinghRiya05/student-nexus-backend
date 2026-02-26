import nodemailer from "nodemailer";
import env from "../core/env";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,      
  port: Number(env.MAIL_PORT), 
  secure: false,           
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS
  }
});


transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server error:", error);
  } else {
    console.log("✅ Mail server is ready");
  }
});

export default transporter;