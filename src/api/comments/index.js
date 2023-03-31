import Express from "express";
import CommentsModel from "./model.js";
import { comment404 } from "../../errorHandlers.js";
import UsersModel from "../users/model.js";

const CommentsRouter = Express.Router();

CommentsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const { commentId } = await CommentsModel.create({
      ...req.body,
      postId: req.params.postId,
    });
    res.status(201).send({ commentId });
  } catch (error) {
    next(error);
  }
});

CommentsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const { count, rows } = await CommentsModel.findAndCountAll({
      where: { postId: req.params.postId },
      include: {
        model: UsersModel,
        attributes: ["firstName", "lastName", "image"],
      },
    });
    res.send({ numOfComments: count, comments: rows });
  } catch (error) {
    next(error);
  }
});

CommentsRouter.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const comment = await CommentsModel.findByPk(req.params.commentId, {
      include: {
        model: UsersModel,
        attributes: ["firstName", "lastName", "image"],
      },
    });
    if (comment) res.send(comment);
    else next(comment404());
  } catch (error) {
    next(error);
  }
});

CommentsRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const [numOfEditedComm, editedComm] = await CommentsModel.update(req.body, {
      where: { postId: req.params.postId },
      returning: true,
    });
    if (numOfEditedComm !== 0) res.send(editedComm[0]);
    else next(comment404());
  } catch (error) {
    next(error);
  }
});

CommentsRouter.delete(
  "/:postId/comments/:commentId",
  async (req, res, next) => {
    try {
      const numDeletedComm = await CommentsModel.destroy({
        where: { commentId: req.params.commentId },
      });
      if (numDeletedComm !== 0) res.status(204).send();
      else next(comment404());
    } catch (error) {
      next(error);
    }
  }
);

export default CommentsRouter;
