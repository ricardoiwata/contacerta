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

const IncomeForm = ({ income: initialIncome, onClose }) => {
  const [income, setIncome] = useState({
    value: "",
    name: "",
    date: "",
    recurring: false,
  });

  useEffect(() => {
    if (initialIncome) {
      // Transform the date format to YYYY-MM-DD if it's not already
      const formattedIncome = {
        ...initialIncome,
        dueDate: initialIncome.dueDate
          ? new Date(initialIncome.dueDate).toISOString().split("T")[0]
          : "",
      };
      setIncome(formattedIncome);
    }
  }, [initialIncome]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIncome((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleValueChange = (values) => {
    const { value } = values;
    setIncome((prevState) => ({
      ...prevState,
      value,
    }));
  };

  const handleCurrentDate = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setIncome((prevState) => ({
      ...prevState,
      date: currentDate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialIncome) {
      apiService
        .updateIncome(initialIncome._id, income)
        .then((response) => {
          toast.success("Renda atualizada com sucesso!");
          onClose();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      apiService
        .createIncome(income)
        .then((response) => {
          toast.success("Renda adicionada com sucesso!");
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
        mt: 10,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {initialIncome ? "Editar Renda" : "Registrar Renda"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="Nome"
          name="name"
          value={income.name}
          onChange={handleChange}
          required
          color="success"
        />
        <NumericFormat
          margin="normal"
          fullWidth
          label="Valor"
          name="value"
          value={income.value}
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
            value={income.date}
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
              checked={income.recurring}
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
          {initialIncome ? "Atualizar" : "Salvar"}
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

export default IncomeForm;
