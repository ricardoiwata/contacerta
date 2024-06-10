import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Container, Box } from "@mui/material";
import backgroundImage from "../assets/images/fundo.jpg";

function RegisterPage() {
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
        <RegisterForm />
      </Container>
    </Box>
  );
}

export default RegisterPage;
