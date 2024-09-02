import { Router, type Request, type Response } from 'express'
import user from './user.route'
import note from './notes.route'
import friend from './friend.route'
import comment from './comment.route'
import auth from './auth.route'
import chat from './chat.route'
import like from './like.route'
export interface Route {
  path: string
  route: Router
}
const router = Router()
const routes: Route[] = [
  {
    path: '/user',
    route: user,
  },
  {
    path: '/notes',
    route: note,
  },
  {
    path:'/friend',
    route: friend
  }
  ,{
    path:'/comment',
    route:comment
  },
  {
    path:'/auth',
    route:auth
  },{
  path:'/chat',
  route:chat},
  {
    path:'/like',
    route:like
  }

]

routes.forEach((route) => {
  router.use(route.path, route.route)
})


router.get('/', (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'Welcome to NOTEFLOW API.',
  })
})
export default router
