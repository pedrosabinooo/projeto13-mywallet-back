import joi from "joi";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import db from "./../db.js";

export async function signUp(req, res) {
  const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  });
  const { error } = userSchema.validate(req.body);
  if (error) return res.sendStatus(422);

  try {
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (user) return res.status(403).send("Email already used.");
    const SALT = 10;
    await db.collection("users").insertOne({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, SALT),
    });
    res.sendStatus(201); //created
  } catch (error) {
    console.log("Error creating user.", error);
    res.status(500).send("Error creating user.");
  }
}

export async function logIn(req, res) {
  const userSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
  });
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (!user) return res.sendStatus(404);
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = uuid();
      await db.collection("sessions").insertOne({ token, userId: user._id });
      res.send(token);
    } else {
      res.sendStatus(404); // not found
    }
  } catch (error) {
    console.log("Error logging in user.", error);
    res.status(500).send("Error logging in user.");
  }
}
