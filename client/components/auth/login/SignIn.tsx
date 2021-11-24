import {
  Divider,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Tooltip,
  Typography,
  Zoom,
  Link as MuiLink,
  Box,
  OutlinedInput,
} from "@mui/material";
import NextLink from "next/link";
import { Visibility, VisibilityOff, ErrorOutline } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: initialValues(),

    validationSchema: FormSchema,

    onSubmit: async (formData) => {
      console.log("on submit");
    },
  });
  return (
    <Zoom in={true} timeout={500}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Typography
            component="h1"
            className="lg:text-2xl text-xl font-semibold font-sans"
          >
            Iniciar Sesión
          </Typography>
          <Typography variant="body2">
            O bien,{" "}
            <NextLink href="/register">
              <MuiLink underline="none" className="cursor-pointer">
                Regístrate
              </MuiLink>
            </NextLink>
          </Typography>
        </div>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          className="space-y-5"
        >
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onChange={formik.handleChange}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <div className="flex">
            <button
              type="button"
              className="bg-blue-600 font-semibold mx-auto px-10 py-3 rounded-md text-center text-white"
            >
              Get Started
            </button>
          </div>
        </Box>
        <div className="flex items-center justify-between mt-8 text-sm">
          <NextLink href="/auth/reset">
            <a className="font-semibold hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </NextLink>
          <NextLink href="/auth/resend">
            <a className="font-semibold hover:underline">
              Reenviar email de confirmación
            </a>
          </NextLink>
        </div>
      </div>
    </Zoom>
  );
};

const initialValues = () => {
  return {
    usernameOrEmail: "",
    password: "",
  };
};

const FormSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required(),
  password: Yup.string().required(),
});
