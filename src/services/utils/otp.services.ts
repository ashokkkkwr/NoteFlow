import crypto from 'crypto';
import {generateHtml} from '../../utils/mail.template';
import {EmailService} from './email.service';
import HashService from './hash.service';

 class OtpService {
  constructor(
    private readonly mailService = new EmailService(),
   
  ) {}

  async generateOtp() {
    console.log('otp');
    return crypto.randomInt(10000, 99999);
  }
  async verifyOtp(hashedOtp: string, data: any) {
    const computedHash = HashService.hashOtp(data);
    const isMatch = computedHash === hashedOtp;
    console.log(computedHash,"haha")
    return isMatch
  }
  async sendPasswordResetOtpMail(data: any) {
    await this.mailService.sendMail({
      to: data?.email,
      text: `Your OTP is ${data?.otp}`,
      subject: 'Password Reset OTP',
      html: generateHtml(
        `${data?.otp} is your OTP, Valid for 5 minutes. Do not share it with anyone.`,
      ),
    });
  }
  async sendLoggedInMail(data: any) {
    const mailContent = {
      to: data?.email,
      subject: 'New Login Detected on Your Account',
      text: `Hello ${data?.email || 'User'},\n\nWe noticed a new login to your account from a device. If this was you, no further action is needed.\n\nIf you did not log in, please reset your password immediately.\n\nThank you,\nYour Company Name`,
      html: generateHtml(
        `<p>Hello ${data?.name || 'User'},</p>
         <p>We noticed a new login to your account from a device. If this was you, no further action is needed.</p>
         <p>If you did not log in, please reset your password immediately.</p>
         <p>Thank you,<br/>Your Company Name</p>`
      ),
    };
  
    await this.mailService.sendMail(mailContent);
  }
  
}
export default new OtpService
