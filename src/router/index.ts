import { Router } from "express";
import { authRouter, companyRouter, resumeRouter, userRouter } from "./v1";

const router = Router();

type routes = {
  path: string;
  route: Router;
};

const defaultRoutes: routes[] = [
  {
    path: "/v1/user",
    route: userRouter,
  },
  {
    path: "/v1/auth",
    route: authRouter,
  },
  {
    path: "/v1/resume",
    route: resumeRouter,
  },
  {
    path: "/v1/company",
    route: companyRouter,
  },
];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
