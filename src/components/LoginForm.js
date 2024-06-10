import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import icon from "../assets/images/loginIconContaCerta.png";

const LoginForm = () => {
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("*Obrigatório"),
    password: Yup.string().required("*Obrigatório"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.login(values);
      setSubmitting(false);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 5,
          boxShadow: 3,
          mt: -2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: -3,
          }}
        >
          <img
            src={icon}
            alt="Conta Certa"
            style={{ width: 200, height: 200 }}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  margin="normal"
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
                <Field
                  name="password"
                  as={TextField}
                  label="Senha"
                  type="password"
                  fullWidth
                  margin="normal"
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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3 }}
                  color="success"
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Não tem uma conta?{" "}
            <Link style={{ color: "#2e7d32" }} to="/register">
              Registre-se
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
