import { MediaType } from '../../constant/enum'
import Base from '../../entities/base.entity'
import fs from 'fs'
import path from "path"
import { AfterLoad, Column, Entity, JoinColumn, ManyToMany } from 'typeorm'
import Notes from './notes.entity'
import { DotenvConfig } from '../../config/env.config'
import { getTempFolderPath } from '../../utils/path.utils'
import { getUploadFolderPath } from '../../utils/path.utils'



@Entity('postimage')
export class NoteMedia extends Base{
    @Column()
    name:string
    @Column({
        name:'mimetype',
    })mimetype:string
    @Column({enum:MediaType,type:'enum'})
    type:MediaType

    @ManyToMany(()=>Notes,(notes)=>notes.postImage)
    @JoinColumn({name:'notes_id'})
    notes:Notes

    public path: string
  transferImageFromTempTOUploadFolder(id: string, type: MediaType): void {
    const TEMP_FOLDER_PATH = path.join(getTempFolderPath(), this.name)
    const UPLOAD_FOLDER_PATH = path.join(getUploadFolderPath(), type.toLowerCase(), id.toString())
    !fs.existsSync(UPLOAD_FOLDER_PATH) && fs.mkdirSync(UPLOAD_FOLDER_PATH, { recursive: true })
    fs.renameSync(TEMP_FOLDER_PATH, path.join(UPLOAD_FOLDER_PATH, this.name))
  }

  @AfterLoad()
  async loadImagePath(): Promise<void> {
    // Construct the image path using the BASE_URL, type, id, and name properties.
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id}/${this.name}`
  }
}




