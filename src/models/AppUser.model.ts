import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  Default,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
const bcrypt = require('bcrypt');

@Table({ tableName: 'app_user' })
export default class AppUser extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false })
  declare user_id: string;

  @Unique
  @Column({ type: DataTypes.STRING(320), allowNull: false })
  declare email: string;

  @Column({ type: DataTypes.STRING(32), allowNull: false })
  declare nickname: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  declare password: string;

  @Default(false)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  declare is_admin: boolean;

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  @BeforeCreate
  static async hashPasswordBeforeCreate(user: AppUser) {
    user.password = await this.hashPassword(user.password);
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(user: AppUser) {
    if (user.changed("password")) {
      user.password = await this.hashPassword(user.password);
    }
  }

}
