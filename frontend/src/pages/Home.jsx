import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';


export const HomePage = () => {
  const navigate = useNavigate();
  
  function handleLoginClick(params) {
    navigate(`/login`)
  };

  return (
    <Container component="main" maxWidth="sm">
    <Box
      sx={{
        marginTop: 8,
        marginBottom: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "left"
      }}
    >
      <Typography component="h1" variant="h2" sx={{ mb: 4 }}>
        Hi there! Welcome to Pyhash Dashboard 👋
      </Typography>
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        # About Pyhash Market Making 🤖
      </Typography>
      <Typography component="p" variant="body1" sx={{ mb: 1 }}>
        Founded in 2018, Pyhash started out as a digital asset management institution providing after market support and treasury management solutions to token issuers, institutions, investors, and mining operations in the blockchain ecosystem.
      </Typography>
      <Typography component="p" variant="body1" sx={{ mb: 1 }}>  
        Pyhash trading team is comprised of professionals based around the world with proven technical capabilities and extensive trading experiences.
        The firm has serviced over 20 clients across a variety of geographical jurisdictions and trades upwards of US$50M worth of assets per month.
      </Typography>
      <Typography component="p" variant="body1" sx={{ mb: 4 }}>  
        Pyhash leverages best-in-class trade execution, infrastructure, and market insights to provide lifetime value-add to clients across a broad spectrum of needs.
      </Typography>
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        # Click login to proceed
      </Typography>
      <div>
        <Button size="large" variant="contained" onClick={handleLoginClick}>Login</Button>
      </div>
    </Box>
  </Container>
  )
};
