import { Like } from "../entities/like.entity";
import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import { Notes } from "../entities/note/notes.entity";
import HttpException from "../utils/HttpException.utils";

class LikeService{
    constructor(
        private readonly likeRepo = AppDataSource.getRepository(Like),
        private readonly userRepo = AppDataSource.getRepository(User),
        private readonly postRepo = AppDataSource.getRepository(Notes)

    ){}
    async like(userId:string,postId:string){
        try{
            const user= await this.userRepo.findOneBy({id:userId});
            if(!user)throw HttpException.unauthorized;
            const post = await this.postRepo.findOneBy({id:postId})
            if(!post) throw HttpException.notFound;

            const likes = this.likeRepo.create({
                isLiked:true,
                user:user,
            note:post
            })
            await this.likeRepo.save(likes)
            return likes;
        }catch(error){
            throw HttpException.badRequest('could not save..')
        }
    }
    async dislike(userId:string, postId:string){
        console.log('Attempting to dislike post..')
        try{
            const users = await this.userRepo.findOneBy({id:userId});
            if(!users) throw HttpException.notFound;

            const post= await this.postRepo.findOneBy({id:postId});
            if(!post) throw HttpException.notFound

            const result = await this.likeRepo.delete({
                user: { id: userId },  // Referencing the user entity's ID
                note: {id:post.id},
              });

            return result 

              
              

        }
        catch(error){
            throw HttpException.internalServerError
        }
    }
    async changeLike(userId:string,postId:string){
        try{
            const changeLikes = await this.likeRepo.findOne({
                where:{
                    user:{id:userId},
                    note:{id:postId}
                }
            })
            if(changeLikes){
                await this.dislike(userId,postId)
            }else{
                await this.like(userId,postId)
            }
            return changeLikes
        }catch(error){
            console.log(error)
        }
    }
    async getLikeCount(userId:string, postId:string){
        try{
            const likeCount = await this.likeRepo.count({
                where:{note:{id:postId}}
            })
            return likeCount;
        }catch(error){
            throw HttpException.badRequest
        }
    }

}
export default new LikeService