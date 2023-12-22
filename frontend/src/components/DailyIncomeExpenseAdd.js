// import {
//   createDailyIncomeExpense,
//   updateDailyIncomeExpense
// } from "../functions/DailyIncomeExpense";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createDailyIncomeExpense,
  updateDailyIncomeExpense,
} from "../functions/Functions";
import "../App.css";

function DailyIncomeExpenseAdd() {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitEdit, setIsSubmitEdit] = useState(false);
  const [existsRecord, setExistsRecord] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const initialState = {
    date: "",
    dailyTransactions: [],
  };
  const [rows, setRows] = useState([]);

  const [values, setValues] = useState(initialState);

  const location = useLocation();
  const { state } = location;
  const response = state.response;

  useEffect(() => {
    if (state.response !== null && typeof state.response.date !== "undefined") {
      // Check if state.response.date is a valid Date object
      if (typeof state.response.date === "string") {
        // Assuming state.response.date is a string in the format 'MM/DD/YYYY'
        let originalDateString = new Date(state.response.date);
        originalDateString = originalDateString.toLocaleDateString();
        const dateParts = originalDateString.split("/"); // Split the date string into parts

        if (dateParts.length === 3) {
          // Rearrange the date parts in the desired format 'YYYY/MM/DD'
          const year = dateParts[2];
          const month = dateParts[0].padStart(2, "0"); // Ensure two-digit month format
          const day = dateParts[1].padStart(2, "0"); // Ensure two-digit day format

          const formattedDate = `${year}-${month}-${day}`;
          console.log(formattedDate); // Output: '2023/12/16'

          // Now you can set 'formattedDate' in your state or use it as needed
          setValues({
            ...values,
            date: formattedDate,
            dailyTransactions: state.response.dailyTransactions,
          });
          setRows(state.response.dailyTransactions);
        }
      } else {
        console.error("Invalid date format");
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setValues({ ...values, dailyTransactions: rows });
    let errors = validate(values, rows);
    setFormErrors(errors);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsSubmitEdit(true);
    setValues({ ...values, dailyTransactions: rows });
    let errors = validate(values, rows);
    setFormErrors(errors);
  };

  useEffect(() => {
    if (isSubmit) {
      console.log(values);
      setExistsRecord(false)
      if (Object.keys(formErrors).length === 0) {
        createDailyIncomeExpense(values)
          .then((res) => {
            console.log(res);
            setExistsRecord(false);
            setValues(initialState);
            setIsSubmit(false);
            setRows([]);
            navigate("/list");
          })
          .catch((err) => {
            if (axios.isCancel(err)) {
              // Request was canceled
              console.log("Request canceled:", err.message);
              setIsSubmit(false);
            } else {
              console.log(err);
              if (err.response.data.exists === true) {
                setExistsRecord(true);
                setIsSubmit(false);
              } else {
                setExistsRecord(false);
                setIsSubmit(false);
              }
            }
          });
      }
    }
    if (isSubmitEdit) {
      console.log(values);
      setExistsRecord(false)
      if (Object.keys(formErrors).length === 0) {
        updateDailyIncomeExpense(response._id, values)
          .then((res) => {
            console.log(res);
            setExistsRecord(false);
            setValues(initialState);
            setIsSubmitEdit(false);
            setRows([]);
            navigate("/list");
          })
          .catch((err) => {
            console.log(err);
            if (err.response.data.exists === true) {
              setExistsRecord(true);
              setIsSubmitEdit(false);
            } else {
              setExistsRecord(false);
              setIsSubmitEdit(false);
            }
          });
      }
    }
  }, [isSubmit, isSubmitEdit, values]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    // Perform your cancel logic here
    setValues(initialState);
    setFormErrors({});
    setIsSubmit(false);
    setIsSubmitEdit(false);
    setErrDT(false);
    setExistsRecord(false);
    setRows([]);
    navigate("/list");
  };

  const [errDT, setErrDT] = useState(false);
  const validClassDT = errDT || existsRecord ? "form-control is-invalid" : "form-control";
  const validate = (values, rows) => {
    const errors = {};

    if (!values.date) {
      errors.date = "Date is required";
      setErrDT(true);
    } else {
      setErrDT(false);
    }

    rows.forEach((row, index) => {
      if (!row.label) {
        errors[`label${index}`] = "Name is required";
      }
      if (!row.value) {
        errors[`value${index}`] = `${row.type} is required`;
      }
      if (row.value && row.value < 0) {
        errors[`value${index}`] = `${row.type} should not be less than zero`;
      }
    });

    return errors;
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    // Check if the input is a positive number
    // if (name === "value" && value < 0) {
    //   return; // Do not update the state if the input is negative
    // }
    setRows((rows) => {
      const updatedValues = [...rows];
      updatedValues[index] = { ...updatedValues[index], [name]: value };
      return updatedValues;
    });
  };

  const deleteRow = (e, index) => {
    e.preventDefault();
    const updatedRows = rows;
    updatedRows.splice(index, 1);
    setRows([...updatedRows]);

    delete formErrors[`label${index}`];
    delete formErrors[`value${index}`];

    setFormErrors(formErrors);

    // const updatedValues = [...inputValues];
    // updatedValues.splice(index, 1);
    // setInputValues(updatedValues);
  };

  const addIncomeRow = (e) => {
    e.preventDefault();
    const newRow = { label: "", value: "", type: "Income" };
    // setInputValues([...inputValues, newRow]);
    setRows([...rows, newRow]);
  };
  const addExpenseRow = (e) => {
    e.preventDefault();
    const newRow = { label: "", value: "", type: "Expense" };
    // setInputValues([...inputValues, newRow]);
    setRows([...rows, newRow]);
  };

  return (
    <div className="body-background">
      <h2 className="text-center new-font mt-5">{response.date !== "" ? "Update":"Add"} Daily Income Expense</h2>

      <form className="custom-form-table">
        <div className="mt-3 form-group new-font">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            className={validClassDT}
            value={values.date}
            onChange={handleChange}
            required
          />
          {existsRecord && <p className="text-danger">Date already exists !!</p>}
          {isSubmit && <p className="text-danger">{formErrors.date}</p>}
          {isSubmitEdit && <p className="text-danger">{formErrors.date}</p>}
        </div>

        <div className="mt-3 row new-font">
          {rows &&
            rows.map((row, index) => (
              <>
                <div className="mt-2 col-lg-5">
                  <label htmlFor="label">Label:</label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    className="form-control label-heigth"
                    value={rows[index].label || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                  {isSubmit && (
                    <p className="text-danger">{formErrors[`label${index}`]}</p>
                  )}
                  {isSubmitEdit && (
                    <p className="text-danger">{formErrors[`label${index}`]}</p>
                  )}
                </div>
                <div className="mt-2 col-lg-5">
                  <label htmlFor="value">{row.type}:</label>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    className="form-control"
                    value={rows[index].value || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                  {isSubmit && (
                    <p className="text-danger">{formErrors[`value${index}`]}</p>
                  )}
                  {isSubmitEdit && (
                    <p className="text-danger">{formErrors[`value${index}`]}</p>
                  )}
                </div>
                <div className="mt-2 col-lg-2">
                  <button
                    type="submit"
                    className="btn btn-danger mt-4"
                    onClick={(e) => {
                      deleteRow(e, index);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            ))}
        </div>
        <div className="col-lg-5 d-flex justify-content-start align-items-center gap-4 new-font ">
          <h6 className="mt-4 text-align">Add New Row: </h6>
          <button
            type="submit"
            className="btn btn-primary mt-4"
            style={{ color: "white", backgroundColor: "darkgreen" }}
            onClick={(e) => addIncomeRow(e)}
          >
            Income
          </button>
          <button
            type="submit"
            className="btn btn-primary mt-4"
            style={{ color: "white", backgroundColor: "darkgreen" }}
            onClick={(e) => addExpenseRow(e)}
          >
            Expense
          </button>
        </div>

        <div className="mt-3 d-flex justify-content-end gap-3 new-font">
          {response.date !== "" ? (
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleUpdate}
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default DailyIncomeExpenseAdd;
