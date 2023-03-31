import Express from "express";

const ExperiencesRouter = Express.Router();

ExperiencesRouter.post("/experiences", async (req, res, next) => {
  try {
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.get("/experiences", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.get("/experiences/:expId", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.put("/experiences/:expId", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

ExperiencesRouter.delete("/experiences/:expId", async (req, res, next) => {
  try {
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default ExperiencesRouter;
