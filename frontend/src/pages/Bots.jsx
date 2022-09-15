import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Chip, { ChipProps } from "@mui/material/Chip";
import { red, green } from '@mui/material/colors';
import axios from "../api/axios";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

import Button from "@mui/material/Button";

const BOTS_URL = '/bot/list/'


function getChipProps(params: GridRenderCellParams): ChipProps {
    if (params.value === "inactive") {
      return {
        icon: <CancelIcon style={{ fill: red[500] }} />,
        label: params.value,
        style: {
          borderColor: red[500]
        }
      };
    } else {
      return {
        icon: <CheckCircleIcon style={{ fill: green[500] }} />,
        label: params.value,
        style: {
          borderColor: green[500]
        }
      };
    }
  }

const columns = [
    { 
        field: 'id', 
        headerName: 'ID', 
        width: 70 
    },
    { 
        field: 'botname', 
        headerName: 'Bot Name',
        minWidth: 200, 
        flex: 1 
    },
    { 
        field: 'bottype', 
        headerName: 'Bot Type',
        minWidth: 75,  
        flex: 1 
    },
    { 
        field: 'description', 
        headerName: 'Description',
        minWidth: 150,  
        flex: 1 
    },
    { 
        field: 'status', 
        headerName: 'Status', 
        width: 150,
        renderCell: (params) => {
            return <Chip variant="outlined" size="small" {...getChipProps(params)} />;
          } 
    },
];



export default function DataTable() {
    const [bots, setBots] = useState([])
    const navigate = useNavigate();
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenError(false);
      };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSuccess(false);
      };

    function handleOnCellClick(params) {
      navigate(`/dashboard/bots/${params.id}`)
    };

    function handleCreate() {
      navigate("/dashboard/bots/newbot")
    }

    const rows = bots

    useEffect(() => {
        axios.get(BOTS_URL, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true
            }).then(response => {
                setBots(response?.data)
                setOpenSuccess(true)
                }
            ).catch((error) => {
              if (error.response.status === 401) {
                  setOpenError(true)
              }
          })
    }, [])
    return (
      <>
        <Container sx={{ height: 'auto' , paddingTop: 5, paddingBottom: 5}}>
          {/* Render error dialog */}
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openError} autoHideDuration={1000} onClose={handleCloseError}>
            <Alert variant="filled" onClose={handleCloseError} severity="error">
              <AlertTitle>Error</AlertTitle>
              Unauthorized request — <strong>Please log in again!</strong>
            </Alert>
          </Snackbar>
          {/* Render success dialog */}
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSuccess} autoHideDuration={1000} onClose={handleCloseSuccess}>
            <Alert onClose={handleCloseSuccess} severity="success">
              <AlertTitle>Success</AlertTitle>
              Bot list has been fetched — <strong>Check it out!</strong>
            </Alert>
          </Snackbar>
          <Button
          variant="contained"
          sx={{ mt: 1, mb: 2 , mr: 5 }}
          size="medium"
          onClick={handleCreate}
          >                
          Create
          </Button>
            <DataGrid
            rows={rows}
            columns={columns}
            autoHeight={true}
            pageSize={15}
            rowsPerPageOptions={[5, 10, 15, 20, 50]}
            onCellClick={handleOnCellClick}
            />
        </Container>
      </>
  );
}