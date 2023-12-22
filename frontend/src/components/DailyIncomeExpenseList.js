import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import "../App.css";
import Modal from './Modal.js';
import { useModal } from './ModalContext.js'; // Import the ModalContext if needed


import {
  getDailyIncomeExpenseById,
  deleteDailyIncomeExpense,
  getDailyIncomeExpenses,
} from "../functions/Functions.js";

const DailyIncomeExpenseList = () => {
  const { showModal, closeModal } = useModal();
  const navigate = useNavigate();
  const [dailyIncomeExpense, setDailyIncomeExpense] = useState([]);
  const [incomeAllTotal, setIncomeAllTotal] = useState("");
  const [expenseAllTotal, setExpenseAllTotal] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);
  

  useEffect(() => {
    getDailyIncomeExpenses().then((res) => {
      setDailyIncomeExpense(res.data);
      console.log(res.data);
    });
  }, []);

  useEffect(() => {
    let income = 0;
    let expense = 0;
    dailyIncomeExpense.map((ele) => {
      income = income + parseInt(ele.incomeTotal);
      expense = expense + parseInt(ele.expenseTotal);
    });
    setIncomeAllTotal(income);
    setExpenseAllTotal(expense);
  }, [dailyIncomeExpense]);

  const handleUpdate = (_id) => {
    console.log(_id);
    getDailyIncomeExpenseById(_id).then((res) => {
      const response = res.data;
      navigate("/add", { state: { response} });
    });
  };

  const setFilterData=(filterData)=>{
    setDailyIncomeExpense(filterData.data)
    setFilterApplied(true)
  }

  const handleDelete = (_id) => {
    console.log(_id);
    deleteDailyIncomeExpense(_id)
      .then((res) => {
        getDailyIncomeExpenses().then((res) => {
          setDailyIncomeExpense(res.data);
        });
        console.log(res);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const clearFilter=()=>{
    getDailyIncomeExpenses().then((res) => {
      setDailyIncomeExpense(res.data);
      console.log(res.data);
      setFilterApplied(false)
    });
  }

  return (
    <div className="body-background">
      
      {dailyIncomeExpense.length !== 0 ? (
        <>
          <div className="new-font d-flex justify-content-start gap-4 custom-form-table" style={{marginTop:"80px"}}>
            <h5 className="my-2 ">
              Total Balance: {incomeAllTotal - expenseAllTotal} Rs
            </h5>
            <h5 className="my-2 ">Total Income: {incomeAllTotal} Rs</h5>
            <h5 className="my-2 ">Total Expense: {expenseAllTotal} Rs</h5>
            {filterApplied && <button className="btn btn-yellow" onClick={clearFilter}>Clear filter</button>}
          </div>
          <table className="table custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Savings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dailyIncomeExpense.map((daily, index) => {
                // Convert the date string to a JavaScript Date object
                const dateObject = new Date(daily.date);

                // Options to format the date as "2 Aug 2023"
                const options = {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                };

                return (
                  <tr key={daily._id}>
                    <td>{dateObject.toLocaleDateString("en-IN", options)}</td>
                    <td>{daily.incomeTotal} Rs</td>
                    <td>{daily.expenseTotal} Rs</td>
                    <td>{daily.incomeTotal - daily.expenseTotal} Rs</td>
                    <td>
                      <div>
                        <div
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                          }}
                        >
                          <button
                            type="button"
                            // className="btn btn-info"
                            className="btn btn-primary"
                            onClick={() => handleUpdate(daily._id)}
                          >
                            <BsPencilSquare />
                          </button>
                        </div>
                        <div
                          style={{
                            display: "inline-block",
                            marginRight: "10px",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(daily._id)}
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>Total</td>
                <td>{incomeAllTotal} Rs</td>
                <td>{expenseAllTotal} Rs</td>
                <td>{incomeAllTotal - expenseAllTotal} Rs</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Render the Modal component */}
          <Modal showModal={showModal} closeModal={closeModal} setFilterData={setFilterData}/>
        </>
      ) : (
        <h5 className="new-font" style={{textAlign:"center", height:"250px",marginTop:"200px"}}>Please add new records !!</h5>
      )}

    </div>
  );
};

export default DailyIncomeExpenseList;
