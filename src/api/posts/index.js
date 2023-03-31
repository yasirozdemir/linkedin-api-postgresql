import Express from "express";
import UsersRouter from "../users/index.js";
import PostsModel from "./model.js";
import UsersModel from "../users/model.js";
import { post404 } from "../../errorHandlers.js";

const PostsRouter = Express.Router();

PostsRouter.post("/", async (req, res, next) => {
  try {
    const { postId } = await PostsModel.create(req.body);
    res.status(201).send({ postId });
  } catch (error) {
    next(error);
  }
});

// GET all posts in the database
PostsRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows } = await PostsModel.findAndCountAll({
      include: {
        model: UsersModel,
        attributes: ["firstName", "lastName", "title", "image"],
      },
    });
    res.send({ numOfPosts: count, posts: rows });
  } catch (error) {
    next(error);
  }
});

// GET all posts of a single user
UsersRouter.get("/:userId/posts", async (req, res, next) => {
  try {
    const { count, rows } = await PostsModel.findAndCountAll({
      where: { userId: req.params.userId },
      include: {
        model: UsersModel,
        attributes: ["firstName", "lastName", "title", "image"],
      },
    });
    res.send({ numOfPosts: count, posts: rows });
  } catch (error) {
    next(error);
  }
});

PostsRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostsModel.findByPk(req.params.postId, {
      include: {
        model: UsersModel,
        attributes: ["firstName", "lastName", "title", "image"],
      },
    });
    if (post) res.send(post);
    else next(post404());
  } catch (error) {
    next(error);
  }
});

PostsRouter.put("/:postId", async (req, res, next) => {
  try {
    const [numOfEditedPosts, editedPosts] = await PostsModel.update(req.body, {
      where: { postId: req.params.postId },
      returning: true,
    });
    if (numOfEditedPosts !== 0) res.send(editedPosts[0]);
    else next(post404());
  } catch (error) {
    next(error);
  }
});

PostsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const numOfDeletedPosts = await PostsModel.destroy({
      where: { postId: req.params.postId },
    });
    if (numOfDeletedPosts !== 0) res.status(204).send();
    else next(post404());
  } catch (error) {
    next(error);
  }
});

export default PostsRouter;
