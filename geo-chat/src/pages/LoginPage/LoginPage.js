import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { CircularProgress } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import { setUserName, setCoordinates, setLoaderOn, setLoaderOff, messagesLoaderSelector, userNameSelector, coordinatesSelector } from "../../store/slices/chatSlice";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesLoader = useSelector(messagesLoaderSelector);
  const userName = useSelector(userNameSelector);
  const coordinates = useSelector(coordinatesSelector);

  const [name, setName] = useState(userName);
  const [lat, setLat] = useState(coordinates.lat);
  const [long, setLong] = useState(coordinates.long);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(setUserName(name));
      dispatch(setCoordinates({lat: parseFloat(lat), long: parseFloat(long)}));
      navigate("/chat");
    },
    [dispatch, name, lat, long, navigate]
  );

  const getGeoAuto = () => {
    dispatch(setLoaderOn());
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude.toFixed(5))
      setLong(pos.coords.longitude.toFixed(5))
      dispatch(setLoaderOff());
    }, () => dispatch(setLoaderOff()) ); 
  };


  if (messagesLoader){
    return <CircularProgress />
  }

  return (
    <Grid container component="main" sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center"
    }}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              fullWidth
              label="Your name"
              autoFocus
            />


            <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={5}>
            <TextField
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              margin="normal"
              required
              fullWidth
              label="Latitude"
              autoFocus
            />
            </Grid><Grid item xs={5}>
            <TextField
              value={long}
              onChange={(e) => setLong(e.target.value)}
              margin="normal"
              required
              fullWidth
              label="Longitude"
              autoFocus
            />
            </Grid>
            <Grid item xs={2}>
            <Button variant="text" onClick={getGeoAuto}>Auto</Button>
            </Grid>

            </Grid>

            

            
            
            
            <Button
              disabled={!name.trim()}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 5 }}
            >
              {"Copyright © "} {new Date().getFullYear()}
              {"."}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
