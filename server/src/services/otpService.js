import axios from "axios";
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

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: {
      user_name: userName || email,
      otp: otp,
      email: email,
    },
  };

  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.data === "OK") {
      console.log("[EmailJS] OTP email sent successfully.");
      return { success: true, data: response.data };
    } else {
      throw new Error(`EmailJS responded with status ${response.status}: ${JSON.stringify(response.data)}`);
    }
  } catch (err) {
    const errMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    console.error("[EmailJS] Error sending email:", errMsg);
    throw new Error(`Failed to send OTP email via EmailJS: ${errMsg}`);
  }
};
