import bcrypt from 'bcryptjs'
class BcryptService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
export default BcryptService

