import app from "./app";

Bun.serve({
  port: process.env.PORT || 4000,
  fetch: app.fetch,
});
