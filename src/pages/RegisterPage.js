import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";

function RegisterPage() {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <RegisterForm />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Já tem uma conta?{" "}
          <Link to="/" style={{ color: "#2e7d32" }}>
            Faça login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default RegisterPage;
