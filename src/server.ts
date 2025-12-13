import app from "./app";
import config from "./config";

const port = config.port || 4000;

// Only listen if not running in a Vercel serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export default app;
