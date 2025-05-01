import express from "express";
import App from "./app";
import { PORT } from "./Configs/env.config";
import { Server } from "node:http";
import { connectDB } from "./Configs/db.config";

const StartServer = async () => {
  let server: Server;
  try {
    const app = express();
    await connectDB();
    await App(app);

    server = app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });

    process.on("SIGINT", async () => {
      if (server) {
        server.close(() => {
          process.exit(0);
        });
      }
    });
    process.on("SIGTERM", async () => {
      console.log("Received SIGTERM. Shutting down gracefully...");
      if (server) {
        server.close(() => {
          process.exit(0);
        });
      }
    });
  } catch (error) {
    console.log("Error in starting server", error);
  }
};

StartServer();
