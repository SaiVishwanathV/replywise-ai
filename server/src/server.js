import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 ReplyWise AI Server running on port ${PORT}`);
  console.log("EMAILJS_SERVICE_ID =", process.env.EMAILJS_SERVICE_ID);
  console.log("EMAILJS_KEY_EXISTS =", !!process.env.EMAILJS_PUBLIC_KEY);
});
