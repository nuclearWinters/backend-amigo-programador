import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";
import { UserDB, DecodeJWT } from "./Database";

const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return next();
    const db: Db = res.locals.db;
    const usuarios = db.collection<UserDB>("usuarios");
    const decoded = jwt.decode(req.headers.authorization);
    const user = await usuarios.findOne({
      id: (decoded as DecodeJWT).id,
    });
    if (!user) throw new Error("El usuario no existe.");
    jwt.verify(req.headers.authorization, user.password);
  } catch (e) {}
};

export default verifyToken;
