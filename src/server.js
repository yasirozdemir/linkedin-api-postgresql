import Express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import { pgConnect } from "./dbConfig.js";
import UsersRouter from "./api/users/index.js";
import ExperiencesRouter from "./api/experiences/index.js";
import PostsRouter from "./api/posts/index.js";

const server = Express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(Express.json());

server.use("/users", UsersRouter);
server.use("/users", ExperiencesRouter);
server.use("/posts", PostsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

await pgConnect();

server.listen(port, () => {
  console.table(listEndpoints(server));
});
