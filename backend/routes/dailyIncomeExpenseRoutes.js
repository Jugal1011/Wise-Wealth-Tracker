const express = require("express");
const router = express.Router();
const cors = require('cors');
const {
  getDailyIncomeExpenses,
  getDailyIncomeExpense,
  createDailyIncomeExpense,
  updateDailyIncomeExpense,
  deleteDailyIncomeExpense,
  generateExcel,
  filterByDate
} = require("../controllers/dailyIncomeExpenseController");
const validateToken=require("../middleware/validateTokenHandler")

// router.use(cors({
//   origin: [`${process.env.FRONTEND_URL}`,`${process.env.FRONTEND_URL}/list`,`${process.env.FRONTEND_URL}/add`],
//   credentials: true, // Enable sending cookies from frontend to backend
// }));
router.use(validateToken);
router.route("/").get(getDailyIncomeExpenses).post(createDailyIncomeExpense);
router
  .route("/:id")
  .get(getDailyIncomeExpense)
  .put(updateDailyIncomeExpense)
  .delete(deleteDailyIncomeExpense);

router.route("/filter-by-date").post(filterByDate);
router.route("/generate-excel").post(generateExcel);

module.exports = router;
