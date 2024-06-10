import React from "react";
import LoginForm from "../components/LoginForm";
import { Container, Box } from "@mui/material";
import backgroundImage from "../assets/images/fundo.jpg";

function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Container maxWidth="xs">
        <LoginForm />
      </Container>
    </Box>
  );
}

export default LoginPage;
