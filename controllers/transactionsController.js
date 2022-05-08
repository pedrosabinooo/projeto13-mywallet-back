import joi from "joi";

import db from "./../db.js";

export async function postNewEntry(req, res) {
  const productSchema = joi.object({
    description: joi.string().required(),
    value: joi.number().required(),
    type: joi.string().required(),
  });
  const { error } = productSchema.validate(req.body);
  if (error) return res.sendStatus(422);

  const { user } = res.locals;
  try {
    await db
      .collection("transactions")
      .insertOne({ ...req.body, userId: user._id });
    res.sendStatus(201); // created
  } catch (error) {
    console.log("Error creating new entry.", error);
    res.status(500).send("Error creating new entry.");
  }
}

export async function getTransactions(req, res) {
  const { user } = res.locals;
  let balance = 0;
  try {
    const transactions = await db
      .collection("transactions")
      .find({ userId: user._id })
      .toArray();
    transactions.map((t) => {
      if (t.type === "income") {
        balance += t.value;
      } else if (t.type === "outcome") {
        balance -= t.value;
      }
      console.log(balance)
    });
    transactions.push({ balance: balance });
    res.send(transactions);
  } catch (error) {
    console.log("Error recovering all transactions.", error);
    res.status(500).send("Error recovering all transactions.");
  }
}
