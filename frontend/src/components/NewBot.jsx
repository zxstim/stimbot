import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

const CREATE_BOT_URL = '/bot/list/'

export default function NewBot() {
    const [bot, setBot] = useState(
        {
            id: '',
            botname: '',
            bottype: '',
            description: '',
            variables: ''
        }
    ) 
    const [editBot, setEditBot] = useState(
        {
            id: '',
            botname: '',
            bottype: '',
            description: '',
            variables: ''
        }
    )
    
    const [editBotArray, setEditBotArray] = useState([])
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

    function handleChange(event) {
        const value = event.target.value;
        setEditBot({
          ...editBot,
          [event.target.name]: value
        });
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
        axios.post(CREATE_BOT_URL, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
            },
            withCredentials: true    
        }).then(response => {
            if (response.status === 201) {
                    setBot(response?.data)
                    setEditBot(response?.data)
                    setOpenSuccess(true)
                }
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

    const handleAddFields = () => {
        let newEditBotArray = [...editBotArray]
        let uid = Date.now().toString()
        newEditBotArray.push(['key', 'value', uid])
        setEditBotArray(newEditBotArray)
    }

    return (
        <Container component="main" maxWidth="lg">
            <Button
            variant="contained"
            sx={{ mt: 2, mb: 1 , mr: 5 }}
            size="medium"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            >                
            Back
            </Button>
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
                    Bot has been created — <strong>Go back to list!</strong>
                </Alert>
            </Snackbar>
        <Box
            sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            paddingBottom: 5
            }}
            >
            <Typography component="h1" variant="h5">
            Bot general information
            </Typography>
                <Box
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                mt: 2
                }}
                >
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
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Submit
                    </Button>
                </Box>     
            
        </Box>
        </Container>
    )
}