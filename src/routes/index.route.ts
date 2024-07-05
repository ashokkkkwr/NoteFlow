import {Router,type Request, type Response} from 'express'
import user from './user.route'


export interface Route{
    path:string
    route:Router
}
const router = Router()
const routes:Route[]=[
    {
        path:'/user',
        route:user,
    }
]
routes.forEach((route) => {
  router.use(route.path, route.route)
})

router.get('/',(req:Request,res:Response)=>{
    res.send({
        success:true,
        message:'Welcome to NOTEFLOW API.'
    })
})
export default router