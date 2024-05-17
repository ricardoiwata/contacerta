import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";

function RegisterPage() {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Conta Certa
        </Typography>
        <RegisterForm />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Já tem uma conta? <Link to="/">Faça login</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default RegisterPage;
