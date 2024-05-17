import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

const RegisterForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    cpf: "",
    birthdate: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Obrigatório"),
    email: Yup.string().email("Email inválido").required("Obrigatório"),
    password: Yup.string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .required("Obrigatório"),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
      .required("Obrigatório"),
    birthdate: Yup.date().required("Obrigatório"),
  });

  const onSubmit = (values) => {
    api
      .post("/api/register", values)
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" mb={2}>
          Registro
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <Form
              onSubmit={handleSubmit}
              style={{ width: "100%", marginTop: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    name="name"
                    as={TextField}
                    label="Nome"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="name" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    as={TextField}
                    label="Email"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="email" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="password"
                    as={TextField}
                    label="Senha"
                    type="password"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="password" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="cpf"
                    as={TextField}
                    label="CPF"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="cpf" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="birthdate"
                    as={TextField}
                    label="Data de Nascimento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="birthdate" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                  >
                    Registrar
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
