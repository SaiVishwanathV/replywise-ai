import emailjs from "@emailjs/nodejs";
import bcrypt from "bcryptjs";

export const generate6DigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

export const verifyOTPHash = async (otp, hashedOtp) => {
  return await bcrypt.compare(otp, hashedOtp);
};

export const sendOTPEmail = async (email, otp, userName = "") => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error("[EmailJS] Error: EmailJS environment variables are missing.");
    throw new Error("EmailJS environment variables are missing.");
  }

  console.log(`[EmailJS] Sending OTP to ${email}...`);

  const templateParams = {
    user_name: userName || email,
    otp: otp,
    email: email,
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey: publicKey,
        privateKey: privateKey,
      }
    );

    console.log("[EmailJS] OTP email sent successfully.");
    return { success: true, data: response };
  } catch (err) {
    const errMsg = err?.text || err?.message || JSON.stringify(err);
    console.error("[EmailJS] Error sending email:", errMsg);
    throw new Error(`Failed to send OTP email via EmailJS: ${errMsg}`);
  }
};