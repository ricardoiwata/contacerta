import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import InputMask from "react-input-mask";
import { addYears, isBefore } from "date-fns";
import { Link } from "react-router-dom";

const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

const RegisterForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    birthdate: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("*Obrigatório"),
    email: Yup.string().email("Email inválido").required("*Obrigatório"),
    password: Yup.string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .required("*Obrigatório"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "As senhas devem coincidir")
      .required("*Obrigatório"),
    cpf: Yup.string()
      .required("*Obrigatório")
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
      .test("cpf-valid", "CPF inválido", (value) => validateCPF(value)),
    birthdate: Yup.date()
      .required("*Obrigatório")
      .test("age", "Idade mínima é 16 anos", (value) => {
        return isBefore(new Date(value), addYears(new Date(), -16));
      }),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await api.registerUser(values);
      toast.success("Usuário adicionado com sucesso!");
      setSubmitting(false);
      navigate("/");
    } catch (error) {
      toast.error("Erro ao adicionar usuário");
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, isValid, dirty }) => (
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
                    helperText={
                      <ErrorMessage
                        name="name"
                        component="div"
                        style={{ color: "red" }}
                      />
                    }
                    color="success"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    as={TextField}
                    label="Email"
                    fullWidth
                    variant="outlined"
                    helperText={
                      <ErrorMessage
                        name="email"
                        component="div"
                        style={{ color: "red" }}
                      />
                    }
                    color="success"
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
                    helperText={
                      <ErrorMessage
                        name="password"
                        component="div"
                        style={{ color: "red" }}
                      />
                    }
                    color="success"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="confirmPassword"
                    as={TextField}
                    label="Confirmar Senha"
                    type="password"
                    fullWidth
                    variant="outlined"
                    helperText={
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        style={{ color: "red" }}
                      />
                    }
                    color="success"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field name="cpf">
                    {({ field }) => (
                      <InputMask {...field} mask="999.999.999-99" maskChar="">
                        {() => (
                          <TextField
                            {...field}
                            label="CPF"
                            fullWidth
                            variant="outlined"
                            helperText={
                              <ErrorMessage
                                name="cpf"
                                component="div"
                                style={{ color: "red" }}
                              />
                            }
                            color="success"
                          />
                        )}
                      </InputMask>
                    )}
                  </Field>
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
                    helperText={
                      <ErrorMessage
                        name="birthdate"
                        component="div"
                        style={{ color: "red" }}
                      />
                    }
                    color="success"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={!(isValid && dirty)}
                  >
                    Registrar
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Já tem uma conta?{" "}
          <Link to="/" style={{ color: "#2e7d32" }}>
            Faça login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
