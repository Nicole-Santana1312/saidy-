const reportModel = require("../models/reportModel");

async function getAdminReports() {
  const [summary, revenueByEvent] = await Promise.all([
    reportModel.getReportSummary(),
    reportModel.getRevenueByEvent(),
  ]);

  return { summary, revenueByEvent };
}

module.exports = {
  getAdminReports,
};
