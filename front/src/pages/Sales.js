import React, { useState } from "react";
import { Container, Typography, Grid, Button, TextField, Snackbar, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import SaleService from "services/SaleService"
import moment from 'moment'
import MuiAlert from "@material-ui/lab/Alert";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useForm, Controller } from "react-hook-form";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Sales() {
  const classes = useStyles();

  const validationSchema = Yup.object().shape({
    codigo_ean: Yup.string()
      .required("El codigo EAN es requerido")
      .min(13, "El codigo EAN debe tener al menos 13 caracteres")
      .max(20, "El codigo EAN no debe exceder los 20 caracteres"),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("warning");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onSubmit = async (data) => {
    setSending(true);
    console.log(data);

    await SaleService.create(data)
      .then((response) => {
        console.log(response.data);
        setOpen(true);
        resetForm();
        setStatus("success");
        setMessage("La venta se registró correctamente");
      })
      .catch((e) => {
        setOpen(true);
        if (e.message === `Request failed with status code 403`) {
          setStatus("error");
          setMessage(
            "No tiene autorizacion para modificar, llame a un Administrador"
          );
        } else if (e.message === `Request failed with status code 401`) {
          setStatus("warning");
          setMessage("Ha ocurrido un error, por favor inicie sesión de nuevo");
        } else {
          setMessage(JSON.stringify(e.message));
          setStatus("error");
        }
      });
    setSending(false);
  };

  const resetForm = () => {
    reset({
      unidad_medida: "",
      cantidad_prod: "",
      denominacion: "",
      codigo_ean: "",
      cantidad_vend: "",
      precio: "",
      fecha: moment().format("yyyy-MM-DD"),
    });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        paddingBottom: 200,
      }}
    >
      <Container maxWidth="sm">
        <div className={classes.mainFeaturedPostContent}>
          <Typography component="h2" variant="h4" color="inherit" gutterBottom>
            Agregar venta
          </Typography>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="codigo_ean"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  required
                  id="codigo_ean"
                  name="codigo_ean"
                  label="Codigo EAN"
                  type="number"
                  fullWidth
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
              defaultValue=""
              rules={{ required: true, minLength: 13 }}
            />
            <ErrorMessage
              errors={errors}
              name="codigo_ean"
              render={({ message }) => (
                <p className={classes.errorMsj}>{message}</p>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Controller
              control={control}
              name="denominacion"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  required
                  id="denominacion"
                  name="denominacion"
                  label="Denominacion"
                  type="text"
                  fullWidth
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              control={control}
              name="precio"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  required
                  id="precio"
                  name="precio"
                  label="Precio"
                  type="number"
                  fullWidth
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="cantidad_prod"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  required
                  id="cantidad_prod"
                  name="cantidad_prod"
                  label="Cantidad producida"
                  type="number"
                  fullWidth
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="unidad_medida"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  required
                  id="unidad_medida"
                  name="unidad_medida"
                  label="Unidad medida"
                  type="text"
                  fullWidth
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="cantidad_vend"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  required
                  id="cantidad_vend"
                  name="cantidad_vend"
                  type="number"
                  label="Cantidad vendida"
                  fullWidth
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="fecha"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  id="fecha"
                  name="fecha"
                  label="Fecha"
                  type="date"
                  fullWidth
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              defaultValue={moment().format("yyyy-MM-DD")}
            />
          </Grid>
        </Grid>

        <div className={classes.buttons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              {/* <Link to="/sales" style={{ textDecoration: "none" }}> */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                {sending ? (
                  <>
                    Registrando <CircularProgress color="secondary" size={22} />{" "}
                  </>
                ) : (
                  "Registrar"
                )}
              </Button>
              {/* </Link> */}
            </Grid>
            <Grid item>
              {/* <Link to="/report" style={{ textDecoration: "none" }}> */}
              <Button variant="contained" color="primary" onClick={resetForm}>
                Limpiar
              </Button>
              {/* </Link> */}
            </Grid>
            <Grid item>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary">
                  Volver Atrás
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={status}>
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  mainFeaturedPostContent: {
    position: "relative",
    alignItems: "center",
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  buttons: {
    marginTop: theme.spacing(7),
  },
  errorMsj: {
    color: "#bf1650",
    margin: theme.spacing(0, 0, 0),
  },
}));