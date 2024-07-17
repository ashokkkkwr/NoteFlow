import crypto from 'crypto'
import { DotenvConfig } from '../../config/env.config'
export class HashService{
    hashOtp(data:string){
        return crypto.createHmac('sha256',DotenvConfig.OTP_SECRET).update(data).digest('hex')
    }
}
