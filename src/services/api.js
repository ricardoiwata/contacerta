import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

const getUserData = () => {
  return api.get("/api/user");
};

const updateUserData = (userData) => {
  return api.put("/api/user", userData);
};

const registerUser = (userData) => {
  return api.post("/api/register", userData);
};

const login = async (userData) => {
  const response = await api.post("/api/login", userData);
  const token = response.data.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response;
};

const createIncome = (incomeData) => {
  return api.post("/api/incomes/registerIncome", incomeData);
};

const getIncomes = () => {
  return api.get("/api/incomes");
};

const updateIncome = (id, incomeData) => {
  return api.put(`/api/incomes/${id}`, incomeData);
};

const deleteIncome = (id) => {
  return api.delete(`/api/incomes/${id}`);
};

const createExpense = (expenseData) => {
  return api.post("/api/expenses/registerExpense", expenseData);
};

const getExpenses = () => {
  return api.get("/api/expenses");
};

const updateExpense = (id, expenseData) => {
  return api.put(`/api/expenses/${id}`, expenseData);
};

const deleteExpense = (id) => {
  return api.delete(`/api/expenses/${id}`);
};

const createDebt = (debtData) => {
  return api.post("/api/debts/registerDebt", debtData);
};

const getDebts = () => {
  return api.get("api/debts");
};

const updateDebt = (id, debtData) => {
  return api.put(`/api/debts/${id}`, debtData);
};

const deleteDebt = (id) => {
  return api.delete(`/api/debts/${id}`);
};

const apiService = {
  getUserData,
  updateUserData,
  registerUser,
  login,
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  createDebt,
  getDebts,
  updateDebt,
  deleteDebt,
};

export default apiService;
