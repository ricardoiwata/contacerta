import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Modal,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Profile from "./Profile";
import Calculator from "./Calculator";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import DebtForm from "./DebtForm";
import apiService from "../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openDebtModal, setOpenDebtModal] = useState(false);

  const [editIncome, setEditIncome] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [editDebt, setEditDebt] = useState(null);

  const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);
  const [openEditExpenseModal, setOpenEditExpenseModal] = useState(false);
  const [openEditDebtModal, setOpenEditDebtModal] = useState(false);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const incomesResponse = await apiService.getIncomes();
      const expensesResponse = await apiService.getExpenses();
      const totalIncome = incomesResponse.data.reduce(
        (acc, income) => acc + income.value,
        0
      );
      const totalExpense = expensesResponse.data.reduce(
        (acc, expense) => acc + expense.value,
        0
      );
      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
    } catch (error) {
      toast.error("Erro ao carregar dados financeiros.");
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
    fetchDebts();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await apiService.getIncomes();
      setIncomes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await apiService.getExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDebts = async () => {
    try {
      const response = await apiService.getDebts();
      setDebts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await apiService.deleteIncome(id);
      toast.success("Renda deletada com sucesso!");
      fetchIncomes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await apiService.deleteExpense(id);
      toast.success("Despesa deletada com sucesso!");
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDebt = async (id) => {
    try {
      await apiService.deleteDebt(id);
      toast.success("Dívida deletada com sucesso!");
      fetchDebts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditIncome = (income) => {
    setEditIncome(income);
    setOpenEditIncomeModal(true);
    fetchIncomes();
  };

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
    setOpenEditExpenseModal(true);
    fetchExpenses();
  };

  const handleEditDebt = (debt) => {
    setEditDebt(debt);
    setOpenEditDebtModal(true);
    fetchDebts();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "calculator":
        return <Calculator />;
      case "dashboard":
      default:
        const total = totalIncome + totalExpense;
        const incomePercentage = (totalIncome / total) * 100;
        const expensePercentage = (totalExpense / total) * 100;
        let message;

        if (totalIncome > totalExpense) {
          message = "Parabéns! Você está indo bem!";
        } else if (totalIncome < totalExpense) {
          message = "Cuidado! Nesse mês você está gastando mais do que ganha!";
        } else if (totalIncome === totalExpense) {
          message =
            "Cuidado! Nesse mês você está equilibrado, mas é interessante possuir mais rendas do que gastos!";
        }

        const totalMessage = totalIncome - totalExpense;

        return (
          <Box
            gap={5}
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box
              flexDirection="column"
              sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 4 }}
            >
              <Button
                variant="contained"
                color="success"
                sx={{ width: "100px", height: "100px" }}
                onClick={() => setOpenIncomeModal(true)}
              >
                Registrar Renda 💸
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ width: "100px", height: "100px" }}
                onClick={() => setOpenExpenseModal(true)}
              >
                Registrar Gasto 💣
              </Button>
              <Button
                variant="contained"
                color="warning"
                sx={{ width: "100px", height: "100px" }}
                onClick={() => setOpenDebtModal(true)}
              >
                Registrar Dívida 📄
              </Button>
            </Box>
            <Box flex={1} flexDirection={"column"}>
              <Box sx={{ width: "100%", mt: 4 }}>
                <Typography
                  variant="h6"
                  color={
                    message === "Parabéns! Você está indo bem!"
                      ? "#2e7d32"
                      : "red"
                  }
                  sx={{ mt: 2 }}
                >
                  {message}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Saldo Final:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalMessage)}
                  {totalMessage > 0 && debts.length > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      {" "}
                      Recomendamos usar esse saldo para amortizar dívidas.
                    </Typography>
                  )}
                  {totalMessage > 0 && debts.length === 0 && (
                    <Typography variant="body2" color="textSecondary">
                      {" "}
                      Recomendamos investir esse saldo.{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setActiveTab("calculator");
                        }}
                      >
                        Invista
                      </span>
                    </Typography>
                  )}
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    height: 10,
                    borderRadius: 5,
                    overflow: "hidden",
                    backgroundColor: "#ccc",
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: `${incomePercentage}%`,
                      height: "100%",
                      backgroundColor: "green",
                      position: "absolute",
                      left: 0,
                    }}
                  />
                  <Box
                    sx={{
                      width: `${expensePercentage}%`,
                      height: "100%",
                      backgroundColor: "red",
                      position: "absolute",
                      right: 0,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Renda:{" "}
                  {isNaN(incomePercentage) ? 0 : incomePercentage.toFixed(2)}%{" "}
                  Gastos:{" "}
                  {isNaN(expensePercentage) ? 0 : expensePercentage.toFixed(2)}%
                </Typography>
              </Box>
              <Box sx={{ width: "100%", mt: 4 }}>
                <Typography variant="h6">Rendas</Typography>
                <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
                  <List disablePadding>
                    {incomes.map((income) => (
                      <ListItem key={income._id}>
                        <ListItemText
                          primary={income.name}
                          secondary={`Valor: ${new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(income.value)} - Data: ${new Date(
                            income.date
                          ).toLocaleDateString()} - Recorrente: ${
                            income.recurring ? "Sim" : "Não"
                          }`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditIncome(income)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteIncome(income._id)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  {incomes.length === 0 && (
                    <Typography variant="body2" color="textSecondary">
                      Não há rendas.
                    </Typography>
                  )}
                </Box>
                <Typography variant="h6">Gastos</Typography>
                <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
                  <List disablePadding>
                    {[...expenses].map((expense) => (
                      <ListItem key={expense._id}>
                        <ListItemText
                          primary={expense.name}
                          secondary={`Valor: ${new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(expense.value)} - Data: ${new Date(
                            expense.date
                          ).toLocaleDateString()} - Recorrente: ${
                            expense.recurring ? "Sim" : "Não"
                          }`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteExpense(expense._id)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  {expenses.length === 0 && (
                    <Typography variant="body2" color="textSecondary">
                      Não há gastos.
                    </Typography>
                  )}
                </Box>
                <Typography variant="h6">Dívidas</Typography>
                <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                  <List disablePadding>
                    {[...debts].map((debt) => (
                      <ListItem key={debt._id}>
                        <ListItemText
                          primary={debt.name}
                          secondary={`Valor: ${new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            debt.value
                          )} - Data de vencimento: ${new Date(
                            debt.dueDate
                          ).toLocaleDateString("pt-BR")}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditDebt(debt)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteDebt(debt._id)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  {debts.length === 0 && (
                    <Typography variant="body2" color="textSecondary">
                      Não há dívidas.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="sm">
      <Tabs
        value={activeTab}
        onChange={(e, value) => setActiveTab(value)}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          marginBottom: 3,
          "& .MuiTabs-indicator": {
            backgroundColor: "#2e7d32",
          },
          "& .MuiTab-textColorPrimary": {
            color: "#2e7d32",
          },
        }}
      >
        <Tab value="calculator" label="Calculadora 📈" />
        <Tab value="dashboard" label="Dashboard 📊" />
        <Tab value="profile" label="Perfil ⚙️" />
      </Tabs>
      {renderContent()}
      <Modal open={openIncomeModal} onClose={() => setOpenIncomeModal(false)}>
        <IncomeForm onClose={() => setOpenIncomeModal(false) && fetchData()} />
      </Modal>
      <Modal open={openExpenseModal} onClose={() => setOpenExpenseModal(false)}>
        <ExpenseForm
          onClose={() => setOpenExpenseModal(false) && fetchData()}
        />
      </Modal>
      <Modal open={openDebtModal} onClose={() => setOpenDebtModal(false)}>
        <DebtForm onClose={() => setOpenDebtModal(false) && fetchData()} />
      </Modal>

      <Modal
        open={openEditIncomeModal}
        onClose={() => setOpenEditIncomeModal(false) && fetchData()}
      >
        <IncomeForm
          income={editIncome}
          onClose={() => setOpenEditIncomeModal(false) && fetchData()}
        />
      </Modal>
      <Modal
        open={openEditExpenseModal}
        onClose={() => setOpenEditExpenseModal(false) && fetchData()}
      >
        <ExpenseForm
          expense={editExpense}
          onClose={() => setOpenEditExpenseModal(false) && fetchData()}
        />
      </Modal>
      <Modal
        open={openEditDebtModal}
        onClose={() => setOpenEditDebtModal(false) && fetchData()}
      >
        <DebtForm debt={editDebt} onClose={() => setOpenEditDebtModal(false)} />
      </Modal>
    </Container>
  );
};

export default Dashboard;
