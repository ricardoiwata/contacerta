import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import apiService from "../services/api";
import { toast } from "react-toastify";

const ExpenseForm = ({ expense: initialExpense, onClose }) => {
  const [expense, setExpense] = useState({
    value: "",
    name: "",
    date: "",
    recurring: false,
  });

  useEffect(() => {
    if (initialExpense) {
      // Transform the date format to YYYY-MM-DD if it's not already
      const formattedExpense = {
        ...initialExpense,
        dueDate: initialExpense.dueDate
          ? new Date(initialExpense.dueDate).toISOString().split("T")[0]
          : "",
      };
      setExpense(formattedExpense);
    }
  }, [initialExpense]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpense((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCurrentDate = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setExpense((prevState) => ({
      ...prevState,
      date: currentDate,
    }));
  };

  const handleValueChange = (values) => {
    const { value } = values;
    setExpense((prevState) => ({
      ...prevState,
      value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialExpense) {
      apiService
        .updateExpense(initialExpense._id, expense)
        .then((response) => {
          toast.success("Gasto atualizado com sucesso!");
          onClose();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      apiService
        .createExpense(expense)
        .then((response) => {
          toast.success("Gasto adicionado com sucesso!");
          onClose();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        width: 500,
        mx: "auto",
        my: "10%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {initialExpense ? "Editar Gasto" : "Registrar Gasto"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="Nome"
          name="name"
          value={expense.name}
          onChange={handleChange}
          required
          color="success"
        />
        <NumericFormat
          margin="normal"
          fullWidth
          label="Valor"
          name="value"
          value={expense.value}
          onValueChange={handleValueChange}
          customInput={TextField}
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          required
          color="success"
        />
        <Box display="flex" gap={2}>
          <TextField
            margin="normal"
            fullWidth
            label="Data"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={expense.date}
            onChange={handleChange}
            required
            color="success"
          />
          <Button
            onClick={handleCurrentDate}
            color="success"
            variant="contained"
          >
            Data Atual
          </Button>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              name="recurring"
              checked={expense.recurring}
              onChange={handleChange}
              color="success"
            />
          }
          label="Recorrente"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
        >
          {initialExpense ? "Atualizar" : "Salvar"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={onClose}
          color="success"
        >
          Cancelar
        </Button>
      </form>
    </Box>
  );
};

export default ExpenseForm;
