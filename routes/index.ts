import { Server } from "@hapi/hapi";

import config from "../config";

import { userRoute } from "./user";

const prefix = `/api/${config.apiVersion}`;

const setRoutes = async (server: Server) => {
  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/user`;
  server.route(userRoute);

};
export default setRoutes;
