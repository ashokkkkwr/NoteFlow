import {Like} from '../entities/like.entity';
import {AppDataSource} from '../config/database.config';
import {User} from '../entities/user/user.entity';
import {Notes} from '../entities/note/notes.entity';
import HttpException from '../utils/HttpException.utils';

class LikeService {
  constructor(
    private readonly likeRepo = AppDataSource.getRepository(Like),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly postRepo = AppDataSource.getRepository(Notes),
  ) {}
  async like(userId: string, postId: string) {
    console.log('🚀 ~ LikeService ~ like ~ postId:', postId);
    try {
      const user = await this.userRepo.findOneBy({id: userId});
      console.log('🚀 ~ LikeService ~ like ~ user:', user);
      if (!user) throw HttpException.unauthorized;
      const post = await this.postRepo.findOneBy({id: postId});
      console.log('🚀 ~ LikeService ~ like ~ post:', post);
      if (!post) throw HttpException.notFound;

      const likes = this.likeRepo.create({
        isLiked: true,
        user: user,
        note: post,
      });
      console.log('🚀 ~ LikeService ~ like ~ likes:', likes);
      await this.likeRepo.save(likes);
      return likes;
    } catch (error) {
      throw HttpException.badRequest('could not save..');
    }
  }
  async dislike(userId: string, postId: string) {
    console.log('Attempting to dislike post..');
    try {
      const users = await this.userRepo.findOneBy({id: userId});
      if (!users) throw HttpException.notFound;

      const post = await this.postRepo.findOneBy({id: postId});
      if (!post) throw HttpException.notFound;

      const result = await this.likeRepo.delete({
        user: {id: userId}, // Referencing the user entity's ID
        note: {id: post.id},
      });

      return result;
    } catch (error) {
      throw HttpException.internalServerError;
    }
  }
  async changeLike(userId: string, postId: string) {
    try {
      const changeLikes = await this.likeRepo.findOne({
        where: {
          user: {id: userId},
          note: {id: postId},
        },
      });
      console.log('🚀 ~ LikeService ~ changeLike ~ changeLikes:', changeLikes);
      if (changeLikes) {
        await this.dislike(userId, postId);
      } else {
        await this.like(userId, postId);
      }
      return changeLikes;
    } catch (error) {
      console.log(error);
    }
  }
  async getLikeCount(postId: string) {
    // try{
    //     const likeCount = await this.likeRepo.count({
    //         where:{note:{id:postId}}
    //     })
    //     return likeCount;
    // }catch(error){
    //     throw HttpException.badRequest
    // }
  }

  async getUserLikes(userId: string) {
    try {
      console.log('haha');
      const user = await this.userRepo.findOne({
        where: {id: userId},
        relations: ['notes'],
      });
      console.log('🚀 ~ LikeService ~ getUserLikes ~ user:', user);
      if (!user) {
        throw HttpException.notFound;
      }
      const likeCount = await this.likeRepo.find({
        where: {
          note: {
            user: {id: userId},
          },
        },
      });
      return likeCount;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw HttpException.internalServerError(error);
      }
    }
  }
  async postLike(userId: string, postId: string) {
    console.log("🚀 ~ LikeService ~ postLike ~ postId:", postId)
    console.log("🚀 ~ LikeService ~ postLike ~ userId:", userId)
    try {
      const user = await this.userRepo.findOneBy({id: userId});
      console.log('🚀 ~ LikeService ~ postLike ~ user:', user);
      if (!user) throw HttpException.badRequest('Unauthorized');
      const likeCount = await this.likeRepo.find({
        where: {note: {id: postId}, user: {id: userId}},
        relations: ['user', 'note'],
      });
      console.log("🚀 ~ LikeService ~ postLike ~ likeCount:", likeCount)
      return likeCount;
    } catch (error) {
      throw HttpException.badRequest;
    }
  }
}
export default new LikeService();
