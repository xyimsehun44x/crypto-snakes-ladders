import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth/discord/callback", "routes/auth.discord.callback.tsx"),
  route("/test-discord", "routes/test-discord.tsx"),
] satisfies RouteConfig;
