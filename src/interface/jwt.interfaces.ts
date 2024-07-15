export interface IJwtOptions {
  secret: string
  expiresIn: string
}
export interface IJwtPayload {
  id: string
}