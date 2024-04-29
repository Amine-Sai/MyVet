const report = require("../models/report");

exports.postReport = async (req, res) => {
  const {reason, body} = req.body
  const {sellerID} = req.params
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
  id = decodedToken.id;

  const report = new Report({
    reason: reason,
    body: body,
    user: id,
    sellerID: sellerID,
  })
  await report.save()
};
