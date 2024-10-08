import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from '../base.entity';
import { Notes } from './notes.entity'; // Corrected import name
import { MediaType } from '../../constant/enum';
import fs from 'fs';
import path from 'path';
import { DotenvConfig } from '../../config/env.config';
import { getTempFolderPath, getUploadFolderPath, getUploadFolderPathForPost } from '../../utils/path.utils';

@Entity('note_media') // Corrected entity name to match the table name
class NoteMedia extends Base {
  @Column()
  name: string;

  @Column({ name: 'mimetype' })
  mimetype: string;

  @Column({ enum: MediaType, type: 'enum' })
  type: MediaType.POST;

  @ManyToOne(() => Notes, (notes) => notes.noteMedia,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'note_id' })
  note: Notes;

  public path: string;

  transferImageFromTempTOUploadFolder(id: string, type: MediaType): void {
    const TEMP_FOLDER_PATH = path.join(getTempFolderPath(), this.name);
    const UPLOAD_FOLDER_PATH = path.join(getUploadFolderPathForPost(), type.toLowerCase(), this.id.toString());
    !fs.existsSync(UPLOAD_FOLDER_PATH) && fs.mkdirSync(UPLOAD_FOLDER_PATH, { recursive: true });
    fs.renameSync(TEMP_FOLDER_PATH, path.join(UPLOAD_FOLDER_PATH, this.name));
  }
  @AfterLoad()
  async loadImagePath(): Promise<void> {
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id}/${this.name}`;
  }
}
export default NoteMedia;
