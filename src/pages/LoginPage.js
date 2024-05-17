import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";

function LoginPage() {
  return (
    <Container maxWidth="xs">
      <Box
        color="black"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color={"#4caf50"}>
          Conta Certa
        </Typography>
        <LoginForm />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Não tem uma conta?{" "}
          <Link color="#1b5e20" to="/register">
            Registre-se
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;
