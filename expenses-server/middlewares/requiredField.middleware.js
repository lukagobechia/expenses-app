export function requiredField(req, res, next) {
  const { category, amount, paymentMethod, date } = req.body;
  if (!category || !amount || !paymentMethod) {
    return res
      .status(400)
      .json({ message: "All the fields are required", data: null });
  }
  next();
}
