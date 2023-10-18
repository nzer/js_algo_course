import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Send } from "@mui/icons-material";
import { Box, Button, CircularProgress, TextField } from "@mui/material";

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
      <Box display="flex" alignItems="center">
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
    </>
  );
};
