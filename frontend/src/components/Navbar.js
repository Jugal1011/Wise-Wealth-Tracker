import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { useModal } from "./ModalContext";
import { logoutUser } from "../functions/Functions";

function Navbar() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleDownload = async () => {
    try {
      // const token = accessToken;
      // const response = await axios.post(
      //   `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense/generate-excel`,
      //   {},
      //   {
      //     responseType: "blob",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense/generate-excel`,
        {},
        {
          responseType: "blob",
          withCredentials: true
        }
      );

      // Convert the buffer to a Blob
      const blob = new Blob([response.data], {
        type: "application/octet-stream", // Set the correct MIME type for Excel
      });

      // Create a URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a link element and set the href and download attributes
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "daily-income-expense.xlsx";

      // Trigger a click event on the link to initiate the download
      a.click();

      // Clean up the created URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log("Error downloading file", error);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const response = {
      date: "",
      dailyTransactions: [],
    };
    navigate("/add", { state: { response} });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    openModal();
  };

  const handleLogOut = async (e) => {
    e.preventDefault();

    try {
      const response = await logoutUser();

      if (response.status === 200) {
        // Handle successful logout - e.g., clear local storage, redirect, etc.
        console.log("Logout successful");
        navigate("/");
      } else {
        // Handle logout failure or server error
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const [isOffcanvasOpen, setOffcanvasOpen] = useState(false);

  const handleOffcanvasToggle = () => {
    setOffcanvasOpen((prevState) => !prevState);
  };

  return (
    <>
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Link className="navbar-brand ml-200px" to="/list">
          Daily Income Expense
        </Link>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => handleAdd(e)}
              >
                Add
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownload}
              >
                Generate Excel
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav> */}

      <nav class="navbar navbar-expand-lg navbar-dark nav-custom fixed-top">
        <Link
          className="navbar-brand"
          to="/list"
          style={{ marginLeft: "15px" }}
        >
          <p className="white-color mt-lg-4">Daily Income Expense</p>
        </Link>
        <button
          className="navbar-toggler mb-sm-2"
          type="button"
          onClick={handleOffcanvasToggle}
          ariaControls="navbarOffcanvasLg"
          ariaLabel="Toggle navigation"
          dataBsToggle="offcanvas" // camelCase conversion
          dataBsTarget="#navbarOffcanvasLg" // camelCase conversion
          style={{ border: "2px solid whitesmoke", marginBottom: "30px" }}
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          className={`offcanvas offcanvas-end  ${
            isOffcanvasOpen ? "show" : ""
          }`}
          tabIndex="-1"
          style={{
            width: "230px",
            height: "210px",
            color: "white",
            backgroundColor: "#042dfa",
            border: "2px solid whitesmoke",
          }}
          id="navbarOffcanvasLg"
          ariaLabelledby="navbarOffcanvasLgLabel"
        >
          <div class="offcanvas-header">
            <h6 class="offcanvas-title white-color" id="offcanvasNavbarLabel">
              Daily Income Expense
            </h6>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              onClick={handleOffcanvasToggle}
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body white-color">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item mt-lg-4">
                <button
                  type="button"
                  className="btn  white-color"
                  onClick={(e) => handleAdd(e)}
                >
                  Add
                </button>
              </li>
              <li className="nav-item mt-lg-4">
                <button
                  type="button"
                  className="btn  white-color"
                  onClick={(e) => handleFilter(e)}
                >
                  Filter By
                </button>
              </li>
              <li className="nav-item mt-lg-4">
                <button
                  type="button"
                  className="btn white-color"
                  onClick={handleDownload}
                >
                  Generate Excel
                </button>
              </li>
              <li className="nav-item mt-lg-4">
                <button
                  type="button"
                  className="btn white-color"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
