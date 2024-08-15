import * as crypto from 'crypto';

export class EncryptionService {
    private static algorithm = 'aes-256-cbc';
    private static key = crypto.scryptSync('password', 'salt', 32); 
    private static iv = Buffer.alloc(16, 0); 

    static encryptMessage(message: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(message, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    static decryptMessage(encryptedMessage: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
