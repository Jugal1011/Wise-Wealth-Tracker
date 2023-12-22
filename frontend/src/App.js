import { React, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import DailyIncomeExpenseList from "./components/DailyIncomeExpenseList";
import DailyIncomeExpenseAdd from "./components/DailyIncomeExpenseAdd";
import Login from "./components/Login";
import { ModalProvider } from "./components/ModalContext";

function App() {
  const List = () => {
    return (
      <>
        <ModalProvider>
          <Navbar/>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <DailyIncomeExpenseList />
              </div>
            </div>
          </div>
        </ModalProvider>
      </>
    );
  };

  const Add = () => {
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <DailyIncomeExpenseAdd />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/list" element={<List />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </>
  );
}

export default App;
