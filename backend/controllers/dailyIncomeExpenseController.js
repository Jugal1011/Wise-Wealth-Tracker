const asyncHandler = require("express-async-handler");
const DailyIncomeExpense = require("../models/dailyIncomeExpenseModal");
const ExcelJS = require("exceljs");

// @desc get all dailyIncomeExpenses
// @route GET /api/dailyIncomeExpenses
// @access private
const getDailyIncomeExpenses = asyncHandler(async (req, res) => {
  const dailyIncomeExpense = await DailyIncomeExpense.find({
    user_id: req.user.id,
  }).sort({ date: 1 });

  res.status(200).json(dailyIncomeExpense);
});

// @desc get dailyIncomeExpense
// @route GET /api/dailyIncomeExpenses/:id
// @access private
const getDailyIncomeExpense = asyncHandler(async (req, res) => {
  const dailyIncomeExpense = await DailyIncomeExpense.findById(req.params.id);
  if (!dailyIncomeExpense) {
    res.status(404);
    throw new Error("Daily Income Expense not found");
  }
  res.status(200).json(dailyIncomeExpense);
});

// @desc create new dailyIncomeExpense
// @route POST /api/dailyIncomeExpenses
// @access private

const createDailyIncomeExpense = asyncHandler(async (req, res) => {
  try {
    const { date, dailyTransactions } = req.body;
    if (!date) {
      res.status(400).json({ message: "All fields are mandatory!!" });
      // throw new Error("All fields are mandatory!!");
    }

    let incomeTotal = 0;
    let expenseTotal = 0;

    if (!dailyTransactions) {
      dailyTransactions = [{ label: "no-label", value: 0, type: "no-type" }];
    } else {
      dailyTransactions.forEach((trans) => {
        if (trans.type === "Income") {
          incomeTotal += parseInt(trans.value) || 0;
        } else {
          expenseTotal += parseInt(trans.value) || 0;
        }
      });
    }

    // Check if the combination of user_id and date already exists
    const existingRecord = await DailyIncomeExpense.findOne({
      user_id: req.user.id,
      date: new Date(date),
    });

    if (existingRecord) {
      res.status(400).json({ exists: true, message:"Given date already exists"  });
    }

    const dailyIncomeExpense = await DailyIncomeExpense.create({
      user_id: req.user.id,
      date: new Date(date),
      dailyTransactions,
      incomeTotal,
      expenseTotal,
    });

    res.status(201).json(dailyIncomeExpense);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating daily income/expense record" });
  }
});

// @desc update dailyIncomeExpense
// @route PUT /api/dailyIncomeExpenses/:id
// @access private

const updateDailyIncomeExpense = asyncHandler(async (req, res) => {
  try {
    const dailyIncomeExpense = await DailyIncomeExpense.findById(req.params.id);
    if (!dailyIncomeExpense) {
      res.status(404).json({ message: "Daily Income Expense not found" });
    }

    if (dailyIncomeExpense.user_id.toString() !== req.user.id) {
      res.status(403).json({ message: "User dont have permisssion to update other user dailyIncomeExpenses" });;
    }

    const { date, dailyTransactions } = req.body;
    if (!date) {
      res.status(400).json({ message: "All fields are mandatory!!" });
    }

    const existingRecord = await DailyIncomeExpense.findOne({
      user_id: req.user.id,
      date: new Date(date),
      _id: { $ne: req.params.id } // excludedRecordId is the ID to be excluded
    });
    

    if (existingRecord && existingRecord !== dailyIncomeExpense) {
      res.status(500).json({ exists: true, message:"Given date already exists" });
    }

    let incomeTotal = 0;
    let expenseTotal = 0;
    if (!dailyTransactions) {
      dailyTransactions = { label: "no-label", value: 0, type: "no-type" };
    } else {
      dailyTransactions.forEach((trans) => {
        if (trans.type === "Income") {
          incomeTotal = incomeTotal + parseInt(trans.value);
        } else {
          expenseTotal = expenseTotal + parseInt(trans.value);
        }
      });
    }

    const updatedDailyIncomeExpense =
      await DailyIncomeExpense.findByIdAndUpdate(
        req.params.id,
        { date: new Date(date), dailyTransactions, incomeTotal, expenseTotal },
        {
          new: true,
        }
      );
    res.status(200).json(updatedDailyIncomeExpense);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error creating daily income/expense record" });
  }
});

// @desc delete dailyIncomeExpense
// @route DELETE /api/dailyIncomeExpenses/:id
// @access private

const deleteDailyIncomeExpense = asyncHandler(async (req, res) => {
  const dailyIncomeExpense = await DailyIncomeExpense.findById(req.params.id);
  if (!dailyIncomeExpense) {
    res.status(404).json({ message: "Daily Income Expense not found" });
  }

  if (dailyIncomeExpense.user_id.toString() !== req.user.id) {
    res.status(403).json({ message: "User dont have permisssion to delete other user daily Income Expenses!" });
  }
  await DailyIncomeExpense.deleteOne({ _id: req.params.id });
  res.status(200).json(dailyIncomeExpense);
});

const filterByDate = asyncHandler(async (req, res) => {
  try {
    let { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      res.status(400).json({ message: "All fields are mandatory!!" });
    }

    startDate= new Date(startDate)
    endDate= new Date(endDate)

    const filterData = await DailyIncomeExpense.find({
      user_id: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.status(200).json(filterData);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error filtering daily income/expense record", err: err });
  }
});

const generateExcel = asyncHandler(async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Daily-Income-Expnese");

    worksheet.columns = [
      {
        header: "Date",
        key: "date",
        width: 14,
        style: {
          alignment: {
            horizontal: "center", // Set the header text in the middle horizontally
          },
        },
      },
      {
        header: "Income",
        key: "incomeTotal",
        style: {
          alignment: {
            horizontal: "center", // Set the header text in the middle horizontally
          },
        },
      },
      {
        header: "Expense",
        key: "expenseTotal",
        style: {
          alignment: {
            horizontal: "center", // Set the header text in the middle horizontally
          },
        },
      },
    ];

    const data = await DailyIncomeExpense.find({
      user_id: req.user.id,
    }).sort({ date: 1 });

    data.forEach((ele) => {
      worksheet.addRow({
        date: ele.date || "",
        incomeTotal: ele.incomeTotal || "",
        expenseTotal: ele.expenseTotal || "",
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    // res.setHeader(
    //   "Content-Type",
    //   "application/vnd.openformats-officedocument.spreadsheet.sheet"
    // )

    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=daily-income-expense.xlsx"
    // )

    const datas = await workbook.xlsx.writeBuffer();
    res.send(datas);
  } catch (error) {
    res.send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

module.exports = {
  getDailyIncomeExpenses,
  getDailyIncomeExpense,
  createDailyIncomeExpense,
  updateDailyIncomeExpense,
  deleteDailyIncomeExpense,
  filterByDate,
  generateExcel,
};
