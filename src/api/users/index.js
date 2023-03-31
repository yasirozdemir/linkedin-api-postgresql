import Express from "express";
import UsersModel from "./model.js";
import { post404, user404 } from "../../errorHandlers.js";
import q2s from "query-to-sequelize";
import ExperiencesModel from "../experiences/model.js";
import { pfpUploader } from "../../lib/cloudinary.js";

const UsersRouter = Express.Router();

UsersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await UsersModel.create(req.body);
    res.status(201).send({ userId });
  } catch (error) {
    next(error);
  }
});

UsersRouter.post("/:userId/pfp", pfpUploader, async (req, res, next) => {
  try {
    const [numOfEditedUsers, updatedUsers] = await UsersModel.update(
      { image: req.file.path },
      { where: { userId: req.params.userId }, returning: true }
    );
    if (numOfEditedUsers !== 0) res.send(updatedUsers[0]);
    else next(post404());
  } catch (error) {
    next(error);
  }
});

UsersRouter.get("/", async (req, res, next) => {
  try {
    const { criteria, options, links } = q2s(req.query); // add links later
    const { count, rows } = await UsersModel.findAndCountAll({
      where: criteria,
      order: options.sort,
      offset: options.skip,
      limit: options.limit,
    });
    res.send({ numberOfUsers: count, users: rows });
  } catch (error) {
    next(error);
  }
});

UsersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      include: {
        model: ExperiencesModel,
        attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
      },
      attributes: { exclude: ["createdAt, updatedAt"] },
    });
    if (user) res.send(user);
    else next(user404());
  } catch (error) {
    next(error);
  }
});

UsersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numOfEditedUsers, updatedUsers] = await UsersModel.update(req.body, {
      where: { userId: req.params.userId },
      returning: true,
    });
    if (numOfEditedUsers !== 0) res.send(updatedUsers[0]);
    else next(user404());
  } catch (error) {
    next(error);
  }
});

UsersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numOfDeletedUsers = await UsersModel.destroy({
      where: { userId: req.params.userId },
    });
    if (numOfDeletedUsers !== 0) res.status(204).send();
    else next(user404());
  } catch (error) {
    next(error);
  }
});

export default UsersRouter;
