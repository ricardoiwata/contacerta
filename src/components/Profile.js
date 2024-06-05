import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button } from "@mui/material";
import InputMask from "react-input-mask";
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    cpf: "",
    email: "",
    birthdate: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formChanged, setFormChanged] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    apiService
      .getUserData()
      .then((response) => {
        const userData = response.data;
        if (userData.birthdate) {
          userData.birthdate = userData.birthdate.split("T")[0];
        }
        setUser(userData);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
    setFormChanged(true);

    if (name === "email") {
      setIsEmailValid(validateEmail(value));
    }
  };

  const validateCpf = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");

    if (cpf.length !== 11) {
      return false;
    }

    let sum;
    let remainder;
    sum = 0;
    if (cpf === "00000000000") return false;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!validateCpf(user.cpf)) {
      validationErrors.cpf = "CPF inválido";
    }

    if (!validateEmail(user.email)) {
      validationErrors.email = "Email inválido";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    apiService
      .updateUserData(user)
      .then((response) => {
        setFormChanged(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "white",
          backgroundPosition: "center",
          height: "65vh",
          borderRadius: 5,
        }}
      >
        <Box
          sx={{
            marginRight: 4,
            marginLeft: 4,
            marginTop: 8,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit} sx>
            <TextField
              margin="normal"
              fullWidth
              label="Nome"
              name="name"
              value={user.name}
              onChange={handleChange}
              color="success"
              sx={{ marginTop: 4 }}
            />
            <InputMask
              mask="999.999.999-99"
              value={user.cpf}
              onChange={handleChange}
            >
              {() => (
                <TextField
                  margin="normal"
                  fullWidth
                  label="CPF"
                  name="cpf"
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                  color="success"
                />
              )}
            </InputMask>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              color="success"
              error={!!errors.email}
              helperText={errors.email}
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
              color="success"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
              disabled={!formChanged || !isEmailValid}
            >
              Salvar
            </Button>
          </form>
          <Button
            variant="contained"
            color="success"
            onClick={handleLogout}
            sx={{ mt: 5 }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
