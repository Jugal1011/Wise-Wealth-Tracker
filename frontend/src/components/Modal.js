import React, { useState } from "react";
import "../css/Modal.css"; // Import your modal styles
import { filterByDate } from "../functions/Functions";

const Modal = ({ accessToken,showModal, closeModal, setFilterData }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (startDate === "" || endDate === "") {
      setError("Please select both start and end dates.");
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (endDateObj <= startDateObj) {
      setError("End date should be greater than the start date.");
      return;
    }

    const filteredDailyIncomeExpense = await filterByDate({startDate,endDate},accessToken)
    console.log(filteredDailyIncomeExpense)
    setFilterData(filteredDailyIncomeExpense)
    setStartDate("");
    setEndDate("");
    setError("");
    closeModal();
  };

  if (!showModal) {
    return null; // If showModal is false, don't render the modal
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={closeModal}>
          &times;
        </span>
        <h2>Filter by Date</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group form-items" >
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              className="form-control"
              onChange={handleStartDateChange}
            />
          </div>
          <div className="form-group form-items" >
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              className="form-control"
              onChange={handleEndDateChange}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="button-group">
            <button type="submit" className="btn btn-primary" style={{marginRight:"10px"}}>Submit</button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={(e) => {
                e.preventDefault();
                setEndDate("");
                setStartDate("");
                setError("");
                closeModal();
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
