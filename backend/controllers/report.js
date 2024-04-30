const report = require("../models/report");

module.exports = async (req, res) => {
  try {
    const {reason, body, sellerId} = req.body
    const { userId } = req;   
  
    const Report = new report({
      reason: reason,
      id: userId,
      body: body,
      sellerId: sellerId,
    })
    await Report.save()
    res.status(200).json({msg: "Report sent, we\'ll respond to it as soon as we can."})
  } catch (error) {
    res
    .status(500)
    .json({ msg: "Something went wrong, please try again" });
  }
};
