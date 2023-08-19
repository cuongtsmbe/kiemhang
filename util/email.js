const nodemailer = require("nodemailer");
const otpModel = require("../models/otp.model");

const transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  secure: false,
  auth: {
    user: "viettri.tl9999@gmail.com",
    pass: "D55E42C39701D9700A52A168E6E4384F19A3",
  },
});

async function sendEmail(_to, subject, text) {
  try {
    const to = _to.toLowerCase();
    await transporter.sendMail({
      from: "viettri.tl9999@gmail.com",
      to,
      subject,
      html: "<p>" + text + "</p>",
    });
  } catch (error) {
    throw error;
  }
}

function generateRandomString() {
    const min = 100000; // Minimum value (inclusive)
    const max = 999999; // Maximum value (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function sendOTP(_email) {
  try {
    const email = _email.toLowerCase();
    const otp = generateRandomString(10);
    // nếu không tìm ra email thì thêm mới otp vào otp.code và otp.email

    const detailOtp = await otpModel.getOne({email:_email});

    if(detailOtp.length==0){
        await otpModel.add({email:_email,code: otp});
    }else{
        await otpModel.update({email:_email},{code: otp});
    }

    const msg =
      "Mã xác nhận của bạn là " +
      otp +
      ". Mã xác nhận có hiệu lực trong 30 phút!";
    await sendEmail(email, "Mã xác nhận", msg);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
  
}

async function verifyOTP(code, email) {
  try {
    const detailsOtp= await otpModel.getVerifyOtp({email,code});
    if(detailsOtp.length!=0) return true
    
  } catch (error) {
    throw error;
  }
  return false;
}

module.exports = {sendOTP,verifyOTP};
// sendEmail('recipient@example.com', 'Hello', 'This is a test email.');