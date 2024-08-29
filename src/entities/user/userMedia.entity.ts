import {AfterLoad, Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import Base from '../base.entity';
import {MediaType} from '../../constant/enum';
import fs from 'fs';
import path from 'path';
import {DotenvConfig} from '../../config/env.config';
import {getTempFolderPath, getUploadFolderPath} from '../../utils/path.utils';
import {UserDetails} from './details.entity';
@Entity('user_media') // Corrected entity name to match the table name
class UserMedia extends Base {
  @Column()
  name: string;

  @Column({name: 'mimetype'})
  mimetype: string;

  @Column({enum: MediaType, type: 'enum'})
  type: MediaType.PROFILE;
  //   @ManyToOne(() => Notes, (notes) => notes.noteMedia)
  //   @JoinColumn({ name: 'note_id' })
  //   note: Notes;
  @ManyToOne(() => UserDetails, (details) => details.profileImage)
  @JoinColumn({name: 'user_id'})
  UserMedia: UserDetails;
  public path: string;
  transferImageFromTempTOUploadFolder(id: string, type: MediaType): void {
    const TEMP_FOLDER_PATH = path.join(getTempFolderPath(), this.name);
    const UPLOAD_FOLDER_PATH = path.join(
      getUploadFolderPath(),
      type.toLowerCase(),
      this.id.toString(),
    )
    !fs.existsSync(UPLOAD_FOLDER_PATH) && fs.mkdirSync(UPLOAD_FOLDER_PATH, {recursive: true});
    fs.renameSync(TEMP_FOLDER_PATH, path.join(UPLOAD_FOLDER_PATH, this.name));
  }

  @AfterLoad()
  async loadImagePath(): Promise<void> {
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id}/${this.name}`;
  }
}

export default UserMedia;
