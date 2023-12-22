import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, loginUser } from "../functions/Functions";
import "../App.css";
import validatior from "validator";

const Login = () => {
  const navigate = useNavigate();
  const [loginPage, setLoginPage] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidEmailPassword, setInvalidEmailPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const initialState = {
    username: "",
    email: "",
    password: "",
  };

  const [signUpValues, setSignUpValues] = useState(initialState);
  const handleSignUp = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setIsRegistered(false);
    let errors = validateSignUpValues(signUpValues);
    setFormErrors(errors);
    // console.log(signUpValues);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      createUser(signUpValues)
        .then((res) => {
          setIsRegistered(false);
          setSignUpValues(initialState);
          setIsLoading(false);
          setLoginPage(true);
          setIsSubmit(false);
          console.log("New user created ", res);
        })
        .catch((err) => {
          const res = err.response;
          if (res !== undefined) {
            if (res.data.registered !== undefined) {
              if (res.data.registered === true) {
                setIsRegistered(true);
              }
            }
          }
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const initialState2 = {
    email: "",
    password: "",
  };

  const [loginValues, setLoginValues] = useState(initialState2);
  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setInvalidEmailPassword(false);
    let errors = validateLoginValues(loginValues);
    setFormErrors(errors);
    // console.log(loginValues);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      loginUser(loginValues)
        .then((res) => {
          setLoginValues(initialState2);
          setInvalidEmailPassword(false);
          setIsLoading(false);
          setIsSubmit(false);
          navigate("/list");
          console.log("User Login", res.data);
        })
        .catch((err) => {
          const res = err.response;
          if (res !== undefined) {
            if (res.data !== undefined) {
              if (res.data.invalidEmailPassword === true) {
                setInvalidEmailPassword(true);
              }
            }
          }
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setSignUpValues(initialState);
    setLoginPage(true);
    setFormErrors({});
    setErrUN(false);
    setErrEM(false);
    setErrPW(false);
    setIsSubmit(false);
    setIsLoading(false);
    setIsRegistered(false);
    setInvalidEmailPassword(false);
  };

  const handleChange = (e) => {
    setSignUpValues({ ...signUpValues, [e.target.name]: e.target.value });
  };

  const handleChange2 = (e) => {
    setLoginValues({ ...loginValues, [e.target.name]: e.target.value });
  };

  const [errUN, setErrUN] = useState(false);
  const [errEM, setErrEM] = useState(false);
  const [errPW, setErrPW] = useState(false);
  const validClassUN = errUN
    ? "form-control is-invalid mb-1"
    : "form-control mb-1";
  const validClassEM = errEM
    ? "form-control is-invalid mb-1"
    : "form-control mb-1";
  const validClassPW = errPW
    ? "form-control is-invalid mb-1"
    : "form-control mb-1";

  const validateSignUpValues = (signUpValues) => {
    const errors = {};

    if (!signUpValues.username) {
      errors.username = "Usename is required";
      setErrUN(true);
    } else {
      setErrUN(false);
    }

    if (!signUpValues.email) {
      errors.email = "Email is required";
      setErrEM(true);
    } else if (
      signUpValues.email &&
      validatior.isEmail(signUpValues.email) === false
    ) {
      errors.email = "Please enter valid email";
      setErrEM(true);
    } else {
      setErrEM(false);
    }

    if (!signUpValues.password) {
      errors.password = "Password is required";
      setErrPW(true);
    } else {
      setErrPW(false);
    }

    return errors;
  };
  const validateLoginValues = (loginValues) => {
    const errors = {};

    if (!loginValues.email) {
      errors.email = "Email is required";
      setErrEM(true);
    } else if (
      loginValues.email &&
      validatior.isEmail(loginValues.email) === false
    ) {
      errors.email = "Please enter valid email";
      setErrEM(true);
    } else {
      setErrEM(false);
    }

    if (!loginValues.password) {
      errors.password = "Password is required";
      setErrPW(true);
    } else {
      setErrPW(false);
    }

    return errors;
  };

  return (
    <>
      <video className="background-video" autoPlay loop muted>
        <source src="/background-video.mp4" type="video/mp4" />
        {/* You can add more source elements for different formats */}
      </video>

      {loginPage ? (
        <>
          <h1 className="typewriter mt-5">
            <span>Welcome to Jugal Soni's </span>
            <span>Daily Income-Expense </span>
            <span>Managing WebApp!</span>
          </h1>

          <div className="container m-top-res-login login mx-auto max-width-responsive">
            <h2 className="mt-4">Login</h2>
            <form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className={validClassEM}
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={loginValues.email}
                  onChange={handleChange2}
                />
                {isSubmit && <p className="text-danger">{formErrors.email}</p>}
              </div>
              <div className="form-group mt-1">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className={validClassPW}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={loginValues.password}
                  onChange={handleChange2}
                />
                {isSubmit && (
                  <p className="text-danger">{formErrors.password}</p>
                )}
              </div>
              {isLoading && (
                <h6 className="text-align-center">
                  Loading please wait few seconds ....
                </h6>
              )}
              {isInvalidEmailPassword && (
                <h6 className="text-align-center text-danger">
                  Invalid email or password ....
                </h6>
              )}
              <div className="ls-div">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginRight: "15px" }}
                  onClick={(e) => handleLogin(e)}
                >
                  Login
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setLoginPage(false);
                    setLoginValues(initialState2);
                    setSignUpValues(initialState);
                    setFormErrors({});
                    setErrUN(false);
                    setErrEM(false);
                    setErrPW(false);
                    setIsSubmit(false);
                    setIsLoading(false);
                    setIsRegistered(false);
                    setInvalidEmailPassword(false);
                  }}
                  className="btn btn-primary "
                >
                  SignUp
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="container m-top-res-signup max-width-responsive signup">
          <h2 className="mt-4">Sign Up</h2>
          <form className="signup-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className={validClassUN}
                id="username"
                name="username"
                placeholder="Enter username"
                value={signUpValues.username}
                onChange={handleChange}
              />
              {isSubmit && <p className="text-danger">{formErrors.username}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className={validClassEM}
                id="email"
                name="email"
                placeholder="Enter email"
                value={signUpValues.email}
                onChange={handleChange}
              />
              {isSubmit && <p className="text-danger">{formErrors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={validClassPW}
                id="password"
                name="password"
                placeholder="Password"
                value={signUpValues.password}
                onChange={handleChange}
              />
              {isSubmit && <p className="text-danger">{formErrors.password}</p>}
            </div>
            {isLoading && (
              <h6 className="text-align-center">
                Loading please wait few seconds ....
              </h6>
            )}
            {isRegistered && (
              <h6 className="text-align-center text-danger">
                User already registered ....
              </h6>
            )}
            <div className="ls-div">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginRight: "15px" }}
                onClick={(e) => handleSignUp(e)}
              >
                SignUp
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={(e) => handleBack(e)}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
