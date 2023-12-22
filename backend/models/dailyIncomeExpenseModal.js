const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    type: { type: String, required: true },
});

const dailyIncomeExpenseSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date, // Change the type to Date
        required: true,
    },
    dailyTransactions: {
        type: [subSchema],
    },
    incomeTotal: {
        type: String,
    },
    expenseTotal: {
        type: String,
    },
}, {
    timestamps: true,
});

// Compound index to enforce unique combination of user_id and date
dailyIncomeExpenseSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyIncomeExpense', dailyIncomeExpenseSchema);
