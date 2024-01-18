import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { UserModel } from "./models/User.js";
import { MessageModel } from "./models/Message.js";
import { writeFile } from "fs";

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jwt_secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(dirname(fileURLToPath(import.meta.url)) + "/uploads/")
);
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL],
  })
);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, jwt_secret, {}, (err, userInfo) => {
        if (err) throw err;
        resolve(userInfo);
      });
    } else {
      reject("No token");
    }
  });
}

// Auth
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await UserModel.findOne({ username });

  if (foundUser) {
    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (isPasswordCorrect) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwt_secret,
        {},
        (err, token) => {
          if (err) throw err;

          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .status(200)
            .json({
              id: foundUser._id,
              username: foundUser.username,
              status: "ok",
            });
        }
      );
    }
  }
});

app.post("/api/logout", (req, res) => {
  res
    .cookie("token", "", { sameSite: "none", secure: true, maxAge: 0 })
    .json("OK");
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await UserModel.create({
      username,
      password: hashedPassword,
    });

    jwt.sign(
      {
        userId: createdUser._id,
        username,
      },
      jwt_secret,
      {},
      (err, token) => {
        if (err) throw err;

        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
            username: createdUser.username,
            status: "ok",
          });
      }
    );
  } catch (error) {
    if (error) throw error;
    res.status(500);
  }
});

app.get("/api/profile", (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    jwt.verify(token, jwt_secret, {}, (error, userInfo) => {
      if (error) throw error;

      res.json(userInfo);
    });
  } else {
    res.status(401).json("No token");
  }
});

app.get("/api/people", async (req, res) => {
  const users = await UserModel.find({}, { _id: 1, username: 1 });
  res.json(users);
});

app.get("/api/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);

  const messages = await MessageModel.find({
    sender: { $in: [userId, userData.userId] },
    recipient: { $in: [userId, userData.userId] },
  }).sort({ createdAt: 1 });

  res.json(messages);
});

const port = process.env.PORT || 4040;
const server = app.listen(port, () => {
  console.log("Server running on port 4040");
});

const wss = new WebSocketServer({ server, path: "/wss/api" });
wss.on("connection", (connection, req) => {
  function notifyOnlinePeople() {
    // notify everyone about online people (when someone connects)
    [...wss.clients].forEach((client) => {
      const online = [...wss.clients].map((cli) => ({
        userId: cli.userId,
        username: cli.username,
      }));

      client.send(
        JSON.stringify({
          online,
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();

    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyOnlinePeople();
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;

  // read username and id from the cookie for this connection
  if (cookies) {
    const cookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));

    if (cookieString) {
      const token = cookieString.split("=")[1];

      if (token) {
        jwt.verify(token, jwt_secret, {}, (err, userInfo) => {
          if (err) throw err;

          const { userId, username } = userInfo;

          connection.username = username;
          connection.userId = userId;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;

    if (file) {
      const parts = file.name.split(".");
      const extension = parts[parts.length - 1];
      filename = Date.now() + "." + extension;
      const pathname =
        dirname(fileURLToPath(import.meta.url)) + "/uploads/" + filename;
      const buffer = new Buffer(file.data.split(",")[1], "base64");
      writeFile(pathname, buffer, () => {
        console.log("file saved by path:" + pathname);
      });
    }

    if (recipient && (text || file)) {
      const newMessage = await MessageModel.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });

      const filteredConnection = [...wss.clients].filter(
        (client) => client.userId === recipient
      );

      filteredConnection.forEach((client) =>
        client.send(
          JSON.stringify({
            text,
            sender: connection.userId,
            recipient,
            file: file ? filename : null,
            _id: newMessage._id,
          })
        )
      );
    }
  });

  notifyOnlinePeople();
});

wss.on("close", (data) => {
  console.log("disconnect", data);
});
