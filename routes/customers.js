const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middlewares/auth");
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");

  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("Customer with given id is not found.");

  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer(_.pick(req.body, ["name", "isGold", "phone"]));
  await customer.save();

  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { $set: _.pick(req.body, ["name", "isGold", "phone"]) },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("Customer with given id is not found.");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given id is already deleted.");

  res.send(customer);
});

module.exports = router;
