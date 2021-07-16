import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { DataGrid } from "@material-ui/data-grid";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import moment from "moment";
import SaleService from "services/SaleService";
import { Link } from "react-router-dom";
import axios from "axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Report(props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleClick = () => {
    setOpen(true);
    let listaRegistro = data.map((item) => {
      return {
        denominacion: item.denominacion || "",
        codigo_ean: item.codigo_ean || 0,
        precio_unidad: item.precio || 0,
        unidad_medida: item.unidad_medida || "",
        cantidad_prod: item.cantidad_prod || 0,
        cantidad_vend: item.cantidad_vend || 0,
      };
    });

    let infoEmpresa = {
      cuit: 20304050608,
      razon_social: "COPOREICHON SA",
    };
    let periodo = {
      year: moment(data[0].fecha).format("YY"),
      month: moment(data[0].fecha).format("MM"),
    };
    let aEnviar = {
      infoEmpresa: infoEmpresa,
      listaRegistro: listaRegistro,
      periodo: periodo,
    };
    console.log(aEnviar);
    peticion(aEnviar);
  };

  const peticion = async (data) => {
    console.log("- - - -a enviar:", data);
    const respuesta = await axios.post(
      "https://ministeriodesarrolloproductivo.herokuapp.com/api/reports",
      data
    );
    try {
      console.log("respuesta", respuesta);
    } catch (error) {
      console.log("error", error.response.errors);
    }
    return respuesta;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const consultaAPI = async () => {
      const result = await SaleService.getAll();
      setData(result.data);
      setLoading(false);
    };

    consultaAPI();
  }, []);

  const prettyDate = {
    type: "date",
    width: 130,
    valueFormatter: ({ value }) => moment(value).format("DD/MM/YYYY"),
  };

  const currencyFormatter = new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
  });

  const usdPrice = {
    type: "number",
    width: 130,
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 270 },
    { field: "denominacion", headerName: "Denominacion", width: 190 },
    { field: "codigo_ean", headerName: "EAN", width: 190 },
    { field: "cantidad_vend", headerName: "Cantidad", width: 130 },
    { field: "precio", headerName: "Precio", ...usdPrice },
    { field: "fecha", headerName: "Fecha", ...prettyDate },
  ];

  const rows = data;

  return (
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        justifyItems: "center",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="lg">
        <div style={{ height: 580, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            pageSize={9}
            loading={loading}
            onCellDoubleClick={(row) => {
              props.history.push("/item/" + row.row._id);
            }}
          />
        </div>
      </Container>

      <div style={{ margin: 25 }}>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleClick}>
              Enviar Reporte
            </Button>
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
        <Alert onClose={handleClose} severity="success">
          El reporte se envió correctamente!
        </Alert>
      </Snackbar>
    </div>
  );
}
