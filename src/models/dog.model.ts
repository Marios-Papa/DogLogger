import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface DogAttributes {
  id: number;
  name: string;
  breed: string;
  dateOfBirth: Date;
  weight: number;
  height: number;
  age?: number; // Computed based on dateOfBirth
  imageUrl?: string; // Fetched from external API
}

interface DogCreationAttributes extends Optional<DogAttributes, 'id' | 'age' | 'imageUrl'> {}

class Dog extends Model<DogAttributes, DogCreationAttributes> implements DogAttributes {
  public id!: number;
  public name!: string;
  public breed!: string;
  public dateOfBirth!: Date;
  public weight!: number;
  public height!: number;
  public age!: number;
  public imageUrl!: string;
}

Dog.init(
  {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    age: {
      type: DataTypes.VIRTUAL, // Computed field
      get() {
        const dob = new Date(this.getDataValue('dateOfBirth'));
        const diff = Date.now() - dob.getTime();
        return Math.floor(diff / (1000 * 3600 * 24 * 365.25));
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'dogs'
  }
);

export default Dog;
