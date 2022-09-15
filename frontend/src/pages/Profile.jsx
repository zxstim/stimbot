import { useState, useEffect } from "react";
import axios from "../api/axios";
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from '@mui/icons-material/Person';

const USER_URL = '/auth/user/'
const PROFILE_URL = 'userprofile/profile/'
//const GENERATE_KEY = 'userprofile/generate-secret-key/'


export default function ProfilePage() {
  const [user, setUser] = useState(
    {
      pk: '',
      username: '',
      email: '',
      first_name: '',
      last_name: '',
    }
  )
  
  const [profile, setProfile] = useState(
    {
      about: '',
      secret_key: '',
    }
  )

  useEffect(() => {
      axios.get(USER_URL, {
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
          withCredentials: true
          }).then(response => {
              setUser(response?.data)
              }
          )
      
      axios.get(PROFILE_URL, {
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
          withCredentials: true
          }).then(response => {
              setProfile(response?.data)
              }
          )
  }, [])

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingBottom: 5 }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <Box sx={{ mt: 5 }}>
          <TextField
          margin="normal"
          fullWidth
          id="user-id"
          label="ID"
          value={user.pk}
          InputProps={{
            readOnly: true,
          }}
          />
          <TextField
          margin="normal"
          fullWidth
          id="user-name"
          label="Username"
          value={user.username}
          InputProps={{
            readOnly: true,
          }}
          />
          <TextField
          margin="normal"
          fullWidth
          id="user-email"
          label="Email"
          value={user.email}
          InputProps={{
            readOnly: true,
          }}
          />
          <TextField
          margin="normal"
          fullWidth
          id="first-name"
          label="First name"
          value={user.first_name}
          InputProps={{
            readOnly: true,
          }}
          />
          <TextField
          margin="normal"
          fullWidth
          id="last-name"
          label="Last name"
          value={user.last_name}
          InputProps={{
            readOnly: true,
          }}
          />
          <TextField
          margin="normal"
          fullWidth
          id="about"
          label="About"
          value={profile.about}
          InputProps={{
            readOnly: true,
          }}
          />
          <TextField
          margin="normal"
          fullWidth
          id="last-name"
          label="API key"
          value={profile.secret_key}
          InputProps={{
            readOnly: true,
          }}
          />
        </Box>
      </Box>
    </Container>
  )
}