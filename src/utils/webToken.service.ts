import { DotenvConfig } from "../config/env.config";
import { type IJwtOptions,type IJwtPayload } from "../interface/jwt.interfaces";
import jwt from 'jsonwebtoken'
class WebTokenService{

    sign(user:IJwtPayload,options:IJwtOptions):string{
        return jwt.sign(
            {
                id:user.id,
            },
            options.secret,
            {
                expiresIn:options.expiresIn,
            }
        )
    }
    verify(token:string,secret:string):any{
        return jwt.verify(token,secret)
    }
    generateAccessToken(user:IJwtPayload):string{
        return this.sign(
            user,{
                expiresIn:DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
                secret:DotenvConfig.ACCESS_TOKEN_SECRET,
            }
        )
    }
    generateTokens(user:IJwtPayload):{accessToken:string,refreshToken:string}{
        const accessToken=this.sign(
            user,
            {
                expiresIn:DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
                secret:DotenvConfig.ACCESS_TOKEN_SECRET,
            },
            
        )
        const refreshToken = this.sign(
           user,
           {
            expiresIn:DotenvConfig.REFRESH_TOKEN_EXPIRES_IN,
            secret:DotenvConfig.REFRESH_TOKEN_SECRET,
           } 
           
        )
        return {accessToken,refreshToken}
    }
    
}
export default new WebTokenService()