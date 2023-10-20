import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Send } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import ReconnectingEventSource from "reconnecting-eventsource";

import {
  getAllMessages,
  messageSelector,
  messagesLoaderSelector,
  coordinatesSelector,
  messagesSelector,
  userNameSelector,
  addMessage
} from "../../store/slices/chatSlice";

const BASE_URL = 'http://geo-chat-api-env-1.eba-spmyxxbf.eu-north-1.elasticbeanstalk.com/';

export const ChatPage = () => {
  const dispatch = useDispatch();

  const name = useSelector(userNameSelector);
  const messages = useSelector(messagesSelector);
  const coordinates = useSelector(coordinatesSelector);
  const messagesLoader = useSelector(messagesLoaderSelector);
  const messageLoader = useSelector(messageSelector);

  const [text, setText] = useState("");

  const sendMessage = useCallback(() => {
    fetch(BASE_URL + 'message?' + new URLSearchParams({
      message: text,
      name: name,
      lat: coordinates.lat,
      long: coordinates.long,
    }))
    setText("");
  }, [text, name, coordinates.lat, coordinates.long]);

  useEffect(() => {
    dispatch(getAllMessages());
  }, [dispatch]);

  useEffect(() => {
    const sse = new ReconnectingEventSource(BASE_URL +`?lat=${coordinates.lat}&long=${coordinates.long}`,
      { withCredentials: false });
    function getRealtimeData(data) {
      // {"AuthorName":"","Text":"hello1asd23"}
      dispatch(addMessage(data))
    }
    sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      console.log("SSE error occurred")
    }
    return () => {
      sse.close();
    };
  }, [dispatch, coordinates]);


  return messagesLoader ? (
    <CircularProgress />
  ) : (
    <>
      <Grid p={1} container spacing={2} sx={{ height: "100vh", maxHeight: "80vh" }}>
        <Grid item xs={12} md={9} component={Paper} style={{ maxHeight: "100%", overflow: "auto" }}>
          <h1>Welcome, {name}</h1>
          <div style={{ maxHeight: "100%" }}>
            {!!messages.length && (
              <>
                {messages.map((message) => (
                  <Card variant="outlined" sx={{margin: 1, padding: 1}}>
                    <Typography variant="h5" component="div">
                      {message?.userName}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {message?.time}
                    </Typography>
                    <Typography variant="body2">
                      {message?.message}
                    </Typography>
                  </Card>
                ))}
              </>
            )}
          </div>
        </Grid>
        <Grid item xs={12} md={3} alignItems={"end"}>
          <Box display="flex" flexDirection={"column"} justifyContent={"flex-end"} sx={{ height: "100%" }}>
            <h2>Type your message:</h2>
            <Box alignItems={"center"} justifyContent={"center"}>
              <TextField value={text} onChange={(e) => setText(e.target.value)} />
              {messageLoader ? (
                <CircularProgress />
              ) : (
                <Button
                  disabled={!text.trim() || messageLoader}
                  onClick={sendMessage}
                >
                  <Send />
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
