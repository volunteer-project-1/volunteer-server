import { Router } from "express";
import { authRouter, userRouter } from "./v1";

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
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
