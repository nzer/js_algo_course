import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Send } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";

import {
  getAllMessages,
  messageSelector,
  messagesLoaderSelector,
  messagesSelector,
  setMessage,
  userNameSelector,
} from "../../store/slices/chatSlice";

export const ChatPage = () => {
  const dispatch = useDispatch();

  const name = useSelector(userNameSelector);
  const messages = useSelector(messagesSelector);
  const messagesLoader = useSelector(messagesLoaderSelector);
  const messageLoader = useSelector(messageSelector);

  const [text, setText] = useState("");

  const handleSubmit = useCallback(() => {
    dispatch(setMessage({ message: text, userName: name }));
    setText("");
  }, [dispatch, text, name]);

  useEffect(() => {
    dispatch(getAllMessages());
  }, [dispatch]);

  return messagesLoader ? (
    <CircularProgress />
  ) : (
    <>
      <Grid p={1} container spacing={2} sx={{ height: "100vh" }}>
        <Grid item xs={12} md={9} component={Paper}>
          <h1>Welcome, {name}</h1>
          {!!messages.length && (
            <Box>
              {messages.map((message) => (
                <div>
                  <h4>{message?.userName}</h4>
                  <h5>{message?.message}</h5>
                  <h6>{message?.time}</h6>
                </div>
              ))}
            </Box>
          )}
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
                  onClick={handleSubmit}
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
