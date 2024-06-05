import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";

const Calculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [simpleInterest, setSimpleInterest] = useState(null);
  const [compoundInterest, setCompoundInterest] = useState(null);

  const calculateInterests = () => {
    const p = parseFloat(principal.replace(/\./g, "").replace(",", "."));
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    const si = p * r * t;
    setSimpleInterest(si);

    const ci = p * Math.pow(1 + r, t) - p;
    setCompoundInterest(ci);
  };

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
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="#2e7d32"
          marginTop={2}
        >
          Calculadora de Investimentos
        </Typography>
        <NumericFormat
          customInput={TextField}
          label="Valor"
          value={principal}
          onValueChange={(values) => setPrincipal(values.value)}
          margin="normal"
          fullWidth
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          type="text"
          color="success"
        />
        <TextField
          label="Taxa de Rendimento Anual (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          margin="normal"
          fullWidth
          type="number"
          color="success"
        />
        <TextField
          label="Tempo (x) em anos"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          margin="normal"
          fullWidth
          type="number"
          color="success"
        />
        <Button
          variant="contained"
          color="success"
          onClick={calculateInterests}
          sx={{ mt: 3, mb: 1 }}
        >
          Calcular
        </Button>
        {simpleInterest !== null && (
          <Typography variant="body1" sx={{ mt: 3 }}>
            Lucro do investimento gerado a juros simples:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(simpleInterest)}
          </Typography>
        )}
        {compoundInterest !== null && (
          <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
            Lucro do investimento gerado a juros compostos:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(compoundInterest)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Calculator;
