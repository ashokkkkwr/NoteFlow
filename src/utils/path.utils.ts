import path from 'path'
import { Environment } from '../constant/enum'
import fs from 'fs'
export const getUploadFolderPath = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'uploads')
  return path.join(__dirname, '..', '..', 'public', 'uploads')
}
export const getTempFolderPath = (): string => {
  return path.resolve(process.cwd(), 'public', 'uploads', 'temp')
}
export const getTempFolderPathForPost = ():string =>{
  return path.resolve(process.cwd(),'public','uploads','temp')
}
export const getUploadFolderPathForPost=():string =>{
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'uploads')
  return path.join(__dirname,'..','..','public','uploads')
}
export const transferImageFromUploadToTemp=(id:string,name:string,type:string):void => {
  console.log("🚀 ~ transferImageFromUploadToTemp ~ id:", id)
  const UPLOAD_FOLDER_PATH= path.join(getUploadFolderPathForPost(),type.toLowerCase(),id.toString())
  console.log("🚀 ~ transferImageFromUploadToTemp ~ UPLOAD_FOLDER_PATH:", UPLOAD_FOLDER_PATH)

  const TEMP_FOLDER_PATH = path.join(getTempFolderPathForPost(),id.toString())
  console.log("🚀 ~ transferImageFromUploadToTemp ~ TEMP_FOLDER_PATH:", TEMP_FOLDER_PATH)

  if(!fs.existsSync(TEMP_FOLDER_PATH))fs.mkdirSync(TEMP_FOLDER_PATH,{recursive:true})
  const imageName = path.basename(name)
try{
  fs.renameSync(path.join(UPLOAD_FOLDER_PATH,imageName),path.join(TEMP_FOLDER_PATH,imageName))
}catch(err){
console.log("🚀 ~ transferImageFromUploadToTemp ~ err:", err)
}

}

