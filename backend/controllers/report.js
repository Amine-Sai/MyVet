const report = require("../models/report");

exports.postReport = async (req, res) => {
  
  const {reason, body, seller} = req.body;
  id = user.id;
  const report = new Report({
    reason: reason,
    body: body,
    user: id,
    sellerID: seller,
  });
  await report.save();

};
