import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class File {
  @PrimaryGeneratedColumn()
  public id: bigint;

  @Column('varchar')
  public originalFileName: string;

  @Column('varchar')
  public bucketFileName: string;

  @Column('varchar')
  public link: string;

  constructor(originalFileName: string, bucketFileName: string, link: string) {
    this.originalFileName = originalFileName;
    this.bucketFileName = bucketFileName;
    this.link = link;
  }
}
