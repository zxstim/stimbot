import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Container from '@mui/material/Container';
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const LOG_URL = '/bot/internal/log/'

export default function Log() {
    const { botId } = useParams();
    const [logs, setLogs] = useState([])
    const navigate = useNavigate();
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openLogModal, setOpenLogModal] = useState(false);
    const [logToDisplay, setLogToDisplay] = useState({});
    const handleOpenLogModal = () => setOpenLogModal(true);
    const handleCloseLogModal = () => setOpenLogModal(false); 
    
    const columns = [
      { 
          field: 'log_owner', 
          headerName: 'Bot', 
          width: 70 
      },
      { 
          field: 'log_type', 
          headerName: 'Log type', 
          width: 70,
      },
      { 
          field: 'description', 
          headerName: 'Description',
          minWidth: 300,  
          flex: 1 
      },
      { 
          field: 'created_at', 
          headerName: 'Timestamp',
          width: 250,
          renderCell: (params) => {
            return formatTimeStamp(params.value);
          }   
      },
  ];
    const rows = logs

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '1px solid #F5F5F5',
        boxShadow: 24,
        p: 3,
      };

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
        setLogToDisplay(logs.find(log => log.id === params.id))
        handleOpenLogModal()
    };

    function handleBack() {
        navigate(-1)
      };

    function formatTimeStamp(timestamp) {
        // const convertedTimestamp = timestamp.split(" ")[0] + "T" + timestamp.split(" ")[1] + "Z";
        const localTimestamp = new Date(timestamp);
        return localTimestamp.toLocaleString('sv').replace(' ', ', ');
    }

    useEffect(() => {
        axios.get(LOG_URL + botId + '/100/', {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true
            }).then(response => {
                setLogs(response?.data)
                setOpenSuccess(true)
                }
            ).catch((error) => {
              if (error.response.status === 401) {
                  setOpenError(true)
              }
          })
          // eslint-disable-next-line
    }, [])

    function handleRefresh() {
      axios.get(LOG_URL + botId + '/100/', {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
        withCredentials: true
        }).then(response => {
            setLogs(response?.data)
            setOpenSuccess(true)
            }
        ).catch((error) => {
          if (error.response.status === 401) {
              setOpenError(true)
          }
      })
    }
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
              Bot log has been fetched — <strong>Check it out!</strong>
            </Alert>
          </Snackbar>
            <Button
            variant="contained"
            sx={{ mt: 2, mb: 2 , mr: 5 }}
            size="medium"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            >                
            Back
            </Button>
            <Button
            variant="outlined"
            sx={{ mt: 2, mb: 2 , mr: 5 }}
            size="medium"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            >                
            Refresh
            </Button>
            <DataGrid
            rows={rows}
            columns={columns}
            autoHeight={true}
            pageSize={100}
            rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
            onCellClick={handleOnCellClick}
            />
            <Modal
            open={openLogModal}
            onClose={handleCloseLogModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Button 
                        variant="outlined"
                        sx={{ mb: 2 }}
                        onClick={handleCloseLogModal}
                        >
                        Cancel
                        </Button>
                    <Typography id="modal-modal-title" variant="h4" component="h4">
                        Log details
                    </Typography>
                    <Box
                    sx={{
                    marginTop: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    }}
                    >
                    <TextField
                    margin="normal"
                    fullWidth
                    id="id"
                    label="Log ID"
                    name="id"
                    value={logToDisplay.id}
                    InputProps={{
                        readOnly: true,
                    }}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    id="logType"
                    label="Log type"
                    name="logType"
                    value={logToDisplay.log_type}
                    InputProps={{
                        readOnly: true,
                    }}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    id="desc"
                    label="Description"
                    name="desc"
                    value={logToDisplay.description}
                    InputProps={{
                        readOnly: true,
                    }}
                    multiline
                    maxRows={Infinity}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    id="timestamp"
                    label="Timestamp"
                    name="timestamp"
                    value={formatTimeStamp(logToDisplay.created_at)}
                    InputProps={{
                        readOnly: true,
                    }}
                    />
                    </Box>
                </Box>
            </Modal>
        </Container>
      </>
  );
}