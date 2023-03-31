import { DataTypes } from "sequelize";
import sequelize from "../../dbConfig.js";
import ExperiencesModel from "../experiences/model.js";
import PostsModel from "../posts/model.js";

const UsersModel = sequelize.define("user", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// user -> one-to-many -> experiences
UsersModel.hasMany(ExperiencesModel, {
  foreignKey: { name: "userId", allowNull: false },
});
ExperiencesModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

// user -> one-to-many -> posts
UsersModel.hasMany(PostsModel, {
  foreignKey: { name: "userId", allowNull: false },
});
PostsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

export default UsersModel;
