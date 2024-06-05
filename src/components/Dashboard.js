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
import backgroundImage from "../assets/images/fundo2.jpeg";

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
  const [totalDebts, setTotalDebts] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const incomesResponse = await apiService.getIncomes();
      const expensesResponse = await apiService.getExpenses();
      const debtsResponse = await apiService.getDebts();
      const totalIncome = incomesResponse.data.reduce(
        (acc, income) => acc + income.value,
        0
      );
      const totalExpense = expensesResponse.data.reduce(
        (acc, expense) => acc + expense.value,
        0
      );
      const totalDebts = debtsResponse.data.reduce(
        (acc, debt) => acc + debt.value,
        0
      );
      setIncomes(incomesResponse.data);
      setExpenses(expensesResponse.data);
      setDebts(debtsResponse.data);
      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
      setTotalDebts(totalDebts);
    } catch (error) {
      toast.error("Erro ao carregar dados financeiros.");
    }
  };

  const addOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };

  const handleDeleteIncome = async (id) => {
    try {
      await apiService.deleteIncome(id);
      toast.success("Renda deletada com sucesso!");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await apiService.deleteExpense(id);
      toast.success("Despesa deletada com sucesso!");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDebt = async (id) => {
    try {
      await apiService.deleteDebt(id);
      toast.success("Dívida deletada com sucesso!");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditIncome = (income) => {
    setEditIncome(income);
    setOpenEditIncomeModal(true);
  };

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
    setOpenEditExpenseModal(true);
  };

  const handleEditDebt = (debt) => {
    setEditDebt(debt);
    setOpenEditDebtModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "calculator":
        return <Calculator />;
      case "dashboard":
      default:
        const total = totalIncome + totalExpense + totalDebts;
        const incomePercentage = (totalIncome / total) * 100;
        const expensePercentage = (totalExpense / total) * 100;
        const debtsPercentage = (totalDebts / total) * 100;
        const totalGastosPercentage = expensePercentage + debtsPercentage;
        const totalGastos = totalExpense + totalDebts;
        let message;

        if (totalIncome > totalGastos) {
          message = "Parabéns! Você está indo bem!";
        } else if (totalIncome < totalGastos) {
          message = "Cuidado! Nesse mês você está gastando mais do que ganha!";
        } else if (totalIncome === totalGastos) {
          message =
            "Cuidado! Nesse mês você está equilibrado, mas é interessante possuir mais rendas do que gastos!";
        }

        const totalMessage = totalIncome - (totalExpense + totalDebts);

        return (
          <Box
            sx={{
              backgroundColor: "white",
              backgroundPosition: "center",
              height: "100%",
              borderRadius: 5,
            }}
          >
            <Box
              gap={5}
              sx={{
                marginTop: 4,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "20px",
              }}
            >
              <Box flex={1} flexDirection={"column"}>
                <Box sx={{ width: "100%", mt: 2 }}>
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
                        width: `${totalGastosPercentage}%`,
                        height: "100%",
                        backgroundColor: "red",
                        position: "absolute",
                        right: 0,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Renda:{" "}
                    {isNaN(incomePercentage) ? 0 : incomePercentage.toFixed(2)}%
                    Gastos/Dívidas:{" "}
                    {isNaN(totalGastosPercentage)
                      ? 0
                      : totalGastosPercentage.toFixed(2)}
                    %
                  </Typography>
                </Box>
                <Box sx={{ width: "100%", mt: 4 }}>
                  <Typography variant="h6">Rendas</Typography>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ height: "80px", width: "80px" }}
                      onClick={() => setOpenIncomeModal(true)}
                    >
                      Registrar Renda 💸
                    </Button>
                    <Box flex={1} sx={{ maxHeight: 150, overflowY: "auto" }}>
                      <List disablePadding>
                        {incomes.map((income) => (
                          <ListItem key={income._id}>
                            <ListItemText
                              primary={income.name}
                              secondary={`Valor: ${new Intl.NumberFormat(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              ).format(income.value)} - Data: ${addOneDay(
                                income.date
                              ).toLocaleDateString()} - Recorrente: ${
                                income.recurring ? "Sim" : "Não"
                              }`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleEditIncome(income)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
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
                  </Box>
                </Box>
                <Box sx={{ width: "100%", mt: 1 }}>
                  <Typography variant="h6">Gastos</Typography>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ height: "80px", width: "80px" }}
                      onClick={() => setOpenExpenseModal(true)}
                    >
                      Registrar Gasto 💣
                    </Button>
                    <Box flex={1} sx={{ maxHeight: 150, overflowY: "auto" }}>
                      <List disablePadding>
                        {expenses.map((expense) => (
                          <ListItem key={expense._id}>
                            <ListItemText
                              primary={expense.name}
                              secondary={`Valor: ${new Intl.NumberFormat(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              ).format(expense.value)} - Data: ${addOneDay(
                                expense.date
                              ).toLocaleDateString()} - Recorrente: ${
                                expense.recurring ? "Sim" : "Não"
                              }`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleEditExpense(expense)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
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
                  </Box>
                </Box>
                <Box sx={{ width: "100%", mt: 1 }}>
                  <Typography variant="h6">Dívidas</Typography>
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    sx={{ mb: 3 }}
                  >
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ height: "80px", width: "80px" }}
                      onClick={() => setOpenDebtModal(true)}
                    >
                      Registrar Dívida 📄
                    </Button>
                    <Box flex={1} sx={{ maxHeight: 150, overflowY: "auto" }}>
                      <List disablePadding>
                        {debts.map((debt) => (
                          <ListItem key={debt._id}>
                            <ListItemText
                              primary={debt.name}
                              secondary={`Valor: ${new Intl.NumberFormat(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              ).format(
                                debt.value
                              )} - Data de vencimento: ${addOneDay(
                                debt.dueDate
                              ).toLocaleDateString("pt-BR")}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleEditDebt(debt)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
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
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Container width="50%" height="70%" marginBottom="20">
        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            marginBottom: 3,
            "& .MuiTabs-indicator": {
              backgroundColor: "#FFFFFF",
            },
            "& .MuiTab-root": {
              color: "#FFFFFF",
            },
            "& .MuiTab-textColorPrimary.Mui-selected": {
              color: "#FFFFFF",
            },
          }}
        >
          <Tab label="Calculadora 📈" value="calculator" />
          <Tab label="Dashboard 📊" value="dashboard" />
          <Tab label="Perfil ⚙️" value="profile" />
        </Tabs>
        {renderContent()}
      </Container>

      <Modal
        open={openIncomeModal}
        onClose={() => setOpenIncomeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <IncomeForm
          onClose={() => {
            setOpenIncomeModal(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ExpenseForm
          onClose={() => {
            setOpenExpenseModal(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        open={openDebtModal}
        onClose={() => setOpenDebtModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DebtForm
          onClose={() => {
            setOpenDebtModal(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        open={openEditIncomeModal}
        onClose={() => setOpenEditIncomeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <IncomeForm
          income={editIncome}
          onClose={() => {
            setOpenEditIncomeModal(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        open={openEditExpenseModal}
        onClose={() => setOpenEditExpenseModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ExpenseForm
          expense={editExpense}
          onClose={() => {
            setOpenEditExpenseModal(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        open={openEditDebtModal}
        onClose={() => setOpenEditDebtModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DebtForm
          debt={editDebt}
          onClose={() => {
            setOpenEditDebtModal(false);
            fetchData();
          }}
        />
      </Modal>
    </Box>
  );
};

export default Dashboard;
