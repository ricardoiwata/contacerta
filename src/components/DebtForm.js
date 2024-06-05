import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import apiService from "../services/api";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";

const DebtForm = ({ debt: initialDebt, onClose }) => {
  const [debt, setDebt] = useState({
    name: "",
    value: "",
    dueDate: "",
    numberOfInstallments: "",
    interestRate: "",
  });

  const handleValueChange = (values) => {
    const { value } = values;
    setDebt((prevState) => ({
      ...prevState,
      value,
    }));
  };

  useEffect(() => {
    if (initialDebt) {
      // Transform the date format to YYYY-MM-DD if it's not already
      const formattedDebt = {
        ...initialDebt,
        dueDate: initialDebt.dueDate
          ? new Date(initialDebt.dueDate).toISOString().split("T")[0]
          : "",
      };
      setDebt(formattedDebt);
    }
  }, [initialDebt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDebt((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialDebt) {
        await apiService.updateDebt(initialDebt._id, debt);
        toast.success("Dívida atualizada com sucesso!");
      } else {
        await apiService.createDebt(debt);
        toast.success("Dívida adicionada com sucesso!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dívida.");
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
        mt: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {initialDebt ? "Editar Dívida" : "Adicionar Dívida"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="Nome"
          name="name"
          value={debt.name}
          onChange={handleChange}
          required
          color="success"
        />
        <NumericFormat
          margin="normal"
          fullWidth
          label="Valor"
          name="value"
          value={debt.value}
          onValueChange={handleValueChange}
          customInput={TextField}
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          required
          color="success"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Data de Vencimento"
          name="dueDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={debt.dueDate}
          onChange={handleChange}
          required
          color="success"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Número de Parcelas"
          name="numberOfInstallments"
          value={debt.numberOfInstallments}
          onChange={handleChange}
          type="number"
          required
          color="success"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Taxa de Juros (%)"
          name="interestRate"
          value={debt.interestRate}
          onChange={handleChange}
          type="number"
          required
          color="success"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
        >
          {initialDebt ? "Atualizar" : "Adicionar"}
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

export default DebtForm;
