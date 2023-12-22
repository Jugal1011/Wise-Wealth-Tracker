import axios from "axios";

// Create an instance of axios with withCredentials set to true
const axiosInstance = axios.create({
  withCredentials: true,
});

// Add request interceptor for setting cancel token
axiosInstance.interceptors.request.use(
  (config) => {
    config.cancelToken = new axios.CancelToken((cancel) => {
      // Automatically cancel the request after a certain time
      setTimeout(() => {
        cancel('Request timeout');
      }, 20000); // Change the timeout value as needed
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// All functions below use axiosInstance with withCredentials: true

// Function to create daily income/expense
export const createDailyIncomeExpense = async (values) => {
  return await axiosInstance.post(
    `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense`,
    values
  );
};

// Function to list daily income/expense
export const listDailyIncomeExpenses = async () => {
  return await axiosInstance.get(
    `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense/list`
  );
};

// Function to get daily income/expense
export const getDailyIncomeExpenses = async () => {
  return await axiosInstance.get(
    `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense`
  );
};

// Function to get daily income/expense by ID
export const getDailyIncomeExpenseById = async (_id) => {
  return await axiosInstance.get(
    `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense/${_id}`
  );
};

// Function to delete daily income/expense by ID
export const deleteDailyIncomeExpense = async (_id) => {
  return await axiosInstance.delete(
    `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense/${_id}`
  );
};

// Function to update daily income/expense by ID
export const updateDailyIncomeExpense = async (_id, values) => {
  return await axiosInstance.put(
    `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense/${_id}`,
    values
  );
};

// Function to filter by date
export const filterByDate = async (values) => {
  return await axiosInstance.post(
    `${process.env.REACT_APP_BASE_URL}/api/daily-income-expense/filter-by-date`,
    values
  );
};

// Function to create a user
export const createUser = async (values) => {
  return await axiosInstance.post(
    `${process.env.REACT_APP_BASE_URL}/api/users/register`,
    values
  );
};

// Function to login a user
export const loginUser = async (values) => {
  return await axiosInstance.post(
    `${process.env.REACT_APP_BASE_URL}/api/users/login`,
    values
  );
};

// Function to get current user details
export const currentUser = async () => {
  return await axiosInstance.get(
    `${process.env.REACT_APP_BASE_URL}/api/users/current`
  );
};

// Function to logout a user
export const logoutUser = async () => {
  return await axiosInstance.post(
    `${process.env.REACT_APP_BASE_URL}/api/users/logout`,
    null
  );
};
