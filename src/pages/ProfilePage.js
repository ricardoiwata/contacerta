import React, { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import api from "../services/api";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    cpf: "",
    email: "",
    birthdate: "",
  });

  useEffect(() => {
    api
      .get("/api/user")
      .then((response) => setUser(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put("/api/user", user)
      .then((response) => {})
      .catch((error) => console.error(error));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Perfil
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Nome"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="CPF"
            name="cpf"
            value={user.cpf}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Data de Nascimento"
            name="birthdate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={user.birthdate}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Salvar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProfilePage;
