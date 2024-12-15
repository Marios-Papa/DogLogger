import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isAdmin'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public isAdmin!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true
    },
    password: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'users'
  }
);

export default User;
