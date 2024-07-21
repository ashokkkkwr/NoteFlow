import fs from 'fs'
import path from 'path'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { DotenvConfig } from '../config/env.config'
import { MediaType } from '../constant/enum'
import { getUploadFolderPath, getTempFolderPath } from '../utils/path.utils'

import { UserDetails } from './user/details.entity'
import Base from './base.entity'

@Entity('media')
class Media extends Base {
  @Column({ nullable: true })
  name: string

  @Column({ name: 'mime_type' })
  mimeType: string

  @Column({ enum: MediaType, type: 'enum' })
  type: MediaType

  @ManyToOne(() => UserDetails, (details) => details.profileImage)
  @JoinColumn({ name: 'details_id' })
  details: UserDetails
  

  /**
   * Moves an image file from the temporary folder to the upload folder.
   *
   * @param id - The identifier associated with the image.
   * @param type - The type of the image (e.g., "RESOURCES", "EMPLOYEE").
   */
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
export default Media
