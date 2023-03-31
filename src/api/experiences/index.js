import Express from "express";
import ExperiencesModel from "./model.js";
import { exp404 } from "../../errorHandlers.js";

const ExperiencesRouter = Express.Router();

ExperiencesRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const { expId } = await ExperiencesModel.create({
      ...req.body,
      userId: req.params.userId,
    });
    res.status(201).send({ expId });
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const { count, rows } = await ExperiencesModel.findAndCountAll({
      where: { userId: req.params.userId },
      attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
    });
    res.send({ numOfExperiences: count, experiences: rows });
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperiencesModel.findByPk(req.params.expId, {
      attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
    });
    if (experience) res.send(experience);
    else next(exp404());
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const [numOfEditedExp, editedExp] = await ExperiencesModel.update(
      req.body,
      { where: { expId: req.params.expId }, returning: true }
    );
    if (numOfEditedExp !== 0) res.send(editedExp);
    else next(exp404());
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.delete(
  "/:userId/experiences/:expId",
  async (req, res, next) => {
    try {
      const numOfDeletedExp = await ExperiencesModel.destroy({
        where: { expId: req.params.expId },
      });
      if (numOfDeletedExp !== 0) res.status(204).send();
      else next(exp404());
    } catch (error) {
      next(error);
    }
  }
);

export default ExperiencesRouter;
