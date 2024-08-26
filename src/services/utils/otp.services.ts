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
  verifyOtp(hashedOtp: string, data: any) {
    const computedHash = HashService.hashOtp(data);
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
}
export default new OtpService
