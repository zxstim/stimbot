import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import Chip, { ChipProps } from "@mui/material/Chip";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { red, green } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

const BOT_URL = '/bot/details/'

export default function Bot() {
    const { botId } = useParams();
    const [bot, setBot] = useState(
        {
            id: '',
            botname: '',
            bottype: '',
            description: '',
            status: '',
            variables: ''
        }
    ) 
    const [editBot, setEditBot] = useState(
        {
            id: '',
            botname: '',
            bottype: '',
            description: '',
            status: '',
            variables: ''
        }
    )
    const [openError, setOpenError] = useState(false);
    const [openSuccessFetch, setOpenSuccessFetch] = useState(false);
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

    const handleCloseSuccessFetch = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSuccessFetch(false);
      };

    const [editBotArray, setEditBotArray] = useState([])
    const [editable, setEditable] = useState(false)
    const navigate = useNavigate(); 
    const [openDeleteModal, setOpenDeleteModel] = useState(false);
    const handleOpenDeleteModal = () => setOpenDeleteModel(true);
    const handleCloseDeleteModal = () => setOpenDeleteModel(false);    
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 250,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4,
      };

    useEffect(() => {
        axios.get(`${BOT_URL}${botId}/`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true
            }).then(response => {
                setBot(response?.data)
                setEditBot(response?.data)
                setOpenSuccessFetch(true)
                }
            ).catch((error) => {
                if (error.response.status === 401) {
                    setOpenError(true)
                }
            })
    // eslint-disable-next-line        
    }, [])
    
    function getChipProps(params): ChipProps {
        if (params === "inactive") {
          return {
            icon: <CancelIcon style={{ fill: red[500] }} />,
            label: params,
            style: {
              borderColor: red[500]
            }
          };
        } else {
          return {
            icon: <CheckCircleIcon style={{ fill: green[500] }} />,
            label: params,
            style: {
              borderColor: green[500]
            }
          };
        }
      }

    function handleChange(event) {
        const value = event.target.value;
        setEditBot({
          ...editBot,
          [event.target.name]: value
        });
    }

    function handleStart() {
        const data = { status: 'active'}
        axios.patch(`${BOT_URL}${botId}/`, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true    
        }).then(response => {
            setBot(response?.data)
            setOpenSuccess(true)
            }
        ).catch((error) => {
            if (error.response.status === 401) {
                setOpenError(true)
            }
        })
    }

    function handleStop() {
        const data = { status: 'inactive'}
        axios.patch(`${BOT_URL}${botId}/`, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true    
        }).then(response => {
            setBot(response?.data)
            setOpenSuccess(true)
            }
        ).catch((error) => {
            if (error.response.status === 401) {
                setOpenError(true)
            }
        })
    }

    function addUidToEditBotArray(list) {
        list.forEach(function(item) {
            item.push(item[0] + item[1])
        })
        return list
    }

    function handleVariablesValuesChange(index, event) {
        let value = event.target.value
        let newEditBotArray = [...editBotArray]
        newEditBotArray[index][1] = value
        setEditBotArray(newEditBotArray)
    }    

    function handleVariablesKeysChange(index, event) {
        let key = event.target.value
        let newEditBotArray = [...editBotArray]
        newEditBotArray[index][0] = key
        setEditBotArray(newEditBotArray)
    }

    function handleVariablesDelete(index) {
        let newEditBotArray = [...editBotArray]
        newEditBotArray.splice(index, 1)
        setEditBotArray(newEditBotArray)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let newEditBot = editBot
        newEditBot.variables = Object.fromEntries(editBotArray)
        setEditBot(newEditBot)
        const data = editBot;
        axios.put(`${BOT_URL}${botId}/`, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true    
        }).then(response => {
            setBot(response?.data)
            setEditBot(response?.data)
            setOpenSuccess(true)
            }
        ).catch((error) => {
            if (error.response.status === 401) {
                setOpenError(true)
            }
        })
    };

    function handleDeleteBot() {
        axios.delete(`${BOT_URL}${botId}/`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true    
        }).then(response => {
            navigate(-1)
            }
        ).catch((error) => {
            if (error.response.status === 401) {
                setOpenError(true)
            }
        })
    }

    function handleBack() {
        navigate(-1)
      };

    function handleGoToLog() {
        navigate(`/dashboard/bots/log/${botId}`)
    }

    function renderStartStopButton(botStatus) {
        if (botStatus === 'active') {
            return (
                <Button
                variant="contained"
                sx={{ mt: 2, mb: 1 , mr: 2, backgroundColor: "#f6465d" }}
                size="medium"
                onClick={handleStop}
                startIcon={<CancelIcon />}
                >
                Stop
                </Button>
            ) 
        } else if (botStatus === 'inactive') {
            return (
                <Button
                variant="contained"
                sx={{ mt: 2, mb: 1 , mr: 2, backgroundColor: "#0ecb81" }}
                size="medium"
                onClick={handleStart}
                startIcon={<PlayCircleFilledWhiteIcon />}
                >
                Start
                </Button>        
            )
        }
    }

    const handleAddFields = () => {
        let newEditBotArray = [...editBotArray]
        let uid = Date.now().toString()
        newEditBotArray.push(['key', 'value', uid])
        setEditBotArray(newEditBotArray)
    }

    return (
        <Container component="main" maxWidth="lg" sx={{ height: 'auto' , paddingTop: 5, paddingBottom: 5}}>
            {/* Render error dialog */}
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openError} autoHideDuration={1000} onClose={handleCloseError}>
                <Alert variant="filled" onClose={handleCloseError} severity="error">
                <AlertTitle>Error</AlertTitle>
                Unauthorized request — <strong>Please log in again!</strong>
                </Alert>
            </Snackbar>
            {/* Render success dialog */}
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSuccess} autoHideDuration={1000} onClose={handleCloseSuccess}>
                <Alert variant="filled" onClose={handleCloseSuccess} severity="success">
                <AlertTitle>Success</AlertTitle>
                Bot action success — <strong>Please continue!</strong>
                </Alert>
            </Snackbar>
            {/* Render success fetch dialog */}
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSuccessFetch} autoHideDuration={1000} onClose={handleCloseSuccessFetch}>
                <Alert onClose={handleCloseSuccessFetch} severity="success">
                <AlertTitle>Success</AlertTitle>
                Bot information has been fetched — <strong>Check it out!</strong>
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
            variant="contained"
            sx={{ mt: 2, mb: 2 , mr: 5 }}
            size="medium"
            onClick={handleGoToLog}
            startIcon={<ReceiptLongIcon />}
            >                
            Log
            </Button>
        <Box
            sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            paddingBottom: 5
            }}
            >
            <Box
            sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "left",
            }}
            >
            {renderStartStopButton(bot.status)}
            <Chip variant="outlined" size="medium" {...getChipProps(bot.status)} sx={{ mt: 2.5, mb: 1 , mr: 5 }} />
            </Box>
            <Box
            sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "left",
            }}
            >
                <Button
                variant="contained"
                sx={{ mt: 2, mb: 1, mr: 5, backgroundColor: "#ffbc1d" }}
                size="medium"
                onClick={() => {
                    setEditable(true);
                    setEditBot(bot)
                    setEditBotArray(addUidToEditBotArray(Object.entries(editBot.variables)))
                }}
                startIcon={<EditIcon />}
                >
                Edit
                </Button>
                <Button
                variant="contained"
                sx={{ mt: 2, mb: 1 , mr: 5, backgroundColor: "#808080" }}
                size="medium"
                startIcon={<ClearIcon />}
                onClick={() => {
                    setEditable(false);
                    setEditBot(bot);
                }}
                >
                Cancel
                </Button>
            </Box>
            <Box
            sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "left",
            }}
            >
                <Button
                variant="contained"
                sx={{ mt: 2, mb: 1 , mr: 5, backgroundColor: "#808080" }}
                size="medium"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDeleteModal}
                >
                Delete
                </Button>
                <Modal
                    open={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Are you sure you want to delete the bot?
                        </Typography>
                        <Box
                        sx={{
                        marginTop: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        }}
                        >
                            <Button 
                            variant="outlined"
                            sx={{ mt: 2, mb: 1, mr: 2 }}
                            onClick={handleCloseDeleteModal}
                            >
                            Cancel
                            </Button>
                            <Button
                            variant="contained"
                            sx={{ mt: 2, mb: 1, backgroundColor: "#808080" }}
                            size="medium"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteBot}
                            >
                            Delete
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            { editable ? (
                <Box
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                mt: 2
                }}
                >
                    <Typography component="h1" variant="h5">
                    Bot general information
                    </Typography>
                    <TextField
                    margin="normal"
                    fullWidth
                    id="id"
                    label="ID"
                    name="id"
                    value={bot.id}
                    InputProps={{
                        readOnly: true,
                    }}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    id="botname"
                    name="botname"
                    label="Bot Name"
                    defaultValue={bot.botname}
                    onChange={handleChange}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    id="bottype"
                    name="bottype"
                    label="Bot type"
                    defaultValue={bot.bottype}
                    onChange={handleChange}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    defaultValue={bot.description}
                    onChange={handleChange}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    id="status"
                    label="Status"
                    name="status"
                    value={bot.status}
                    InputProps={{
                        readOnly: true,
                    }}
                    />
                    <Typography component="h1" variant="h5" sx={{ paddingTop: 2, paddingBottom: 2 }}>
                    Bot variables
                    </Typography>
                    <Box
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "left",
                    }}
                    >
                    {   
                        editBotArray.map(([key, value, uid], index) => {
                            return (
                                <Box
                                key={uid}
                                sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                alignItems: "center",
                                }}
                                >
                                    <Box
                                    sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "30%",
                                    alignItems: "center",
                                    mr: 2
                                    }}
                                    >
                                        <TextField
                                        margin="normal"
                                        fullWidth
                                        id={key}
                                        name={key}
                                        defaultValue={key}
                                        onChange={event => handleVariablesKeysChange(index, event)}
                                        />
                                    </Box>
                                    <TextField
                                    margin="normal"
                                    fullWidth
                                    id={value}
                                    name={value}
                                    defaultValue={value}
                                    onChange={event => handleVariablesValuesChange(index, event)}
                                    />
                                    <IconButton sx={{ ml: 1 }} aria-label="delete" size="medium" onClick={() => handleVariablesDelete(index)}>
                                        <DeleteIcon fontSize="medium"/>
                                    </IconButton>
                                </Box>   
                            )
                        })
                    }
                    </Box>
                    <Box
                    sx={{
                    marginTop: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "left",
                    }}
                    >
                        <Button
                        variant="contained"
                        sx={{ mt: 2, mb: 1, mr: 5, backgroundColor: "#ffbc1d" }}
                        size="medium"
                        startIcon={<AddCircleIcon />}
                        onClick={handleAddFields}
                        >
                        Add
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            }}
                    >
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, mr: 2}}
                        >
                        Submit
                        </Button>
                        <Button
                        variant="contained"
                        sx={{ mt: 2, mb: 1 , ml: 2, backgroundColor: "#808080" }}
                        fullWidth
                        size="medium"
                        startIcon={<ClearIcon />}
                        onClick={() => {
                            setEditable(false);
                            setEditBot(bot);
                        }}
                        >
                        Cancel
                        </Button>                        
                    </Box>                    
                </Box>
                ) : (
                    <Box 
                        sx={{ 
                        mt: 2
                        }}
                        >
                        <Typography component="h1" variant="h5" sx={{ paddingTop: 2, paddingBottom: 2 }}>
                        Bot general information
                        </Typography>
                        <TextField
                        margin="normal"
                        fullWidth
                        id="id"
                        label="ID"
                        value={bot.id}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                        <TextField
                        margin="normal"
                        fullWidth
                        id="bot-name"
                        label="Bot Name"
                        value={bot.botname}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                        <TextField
                        margin="normal"
                        fullWidth
                        id="bot-type"
                        label="Bot type"
                        value={bot.bottype}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                        <TextField
                        margin="normal"
                        fullWidth
                        id="bot-description"
                        label="Description"
                        value={bot.description}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                        <TextField
                        margin="normal"
                        fullWidth
                        id="bot-status"
                        label="Status"
                        value={bot.status}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                        <Typography component="h1" variant="h5" sx={{ paddingTop: 2, paddingBottom: 2 }}>
                        Bot variables
                        </Typography>
                        {
                            Object.entries(bot.variables).map(([key, value]) => {
                                return (
                                    <TextField
                                    key={"bot-" + key}
                                    margin="normal"
                                    fullWidth
                                    id={"bot-" + key}
                                    label={key}
                                    value={value}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    />
                                )
                            })
                        }
                    </Box>                    
                )
            }
            
        </Box>
        </Container>
    )
}