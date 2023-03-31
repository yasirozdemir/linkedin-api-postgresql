import { DataTypes } from "sequelize";
import sequelize from "../../dbConfig.js";
import PostsModel from "../posts/model.js";
import UsersModel from "../users/model.js";

const CommentsModel = sequelize.define("comment", {
  commentId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// user -> one-to-many -> comments
UsersModel.hasMany(CommentsModel, {
  foreignKey: { name: "userId", allowNull: false },
});
CommentsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

// post -> one-to-many -> comments
PostsModel.hasMany(CommentsModel, {
  foreignKey: { name: "postId", allowNull: false },
});
CommentsModel.belongsTo(PostsModel, {
  foreignKey: { name: "postId", allowNull: false },
});

export default CommentsModel;
