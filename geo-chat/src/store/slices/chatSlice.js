import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { getAllMessagesApi, setUserMessage } from "../../__mocks__/api";

const initialState = {
  userName: null,
  messagesLoader: false,
  messages: [],
  messageLoader: false,
};

export const getAllMessages = createAsyncThunk(
  "/getMessages",
  async (_, thunkApi) => {
    thunkApi.dispatch(setLoaderOn());
    try {
      const result = await getAllMessagesApi();
      return result;
    } catch (e) {
      console.error(e);
    } finally {
      thunkApi.dispatch(setLoaderOff());
    }
  }
);

export const setMessage = createAsyncThunk(
  "/setMessage",
  async ({ userName, message }, thunkApi) => {
    thunkApi.dispatch(setMessageLoaderOn());
    try {
      const result = await setUserMessage({ userName, message });
      return result;
    } catch (e) {
      console.error(e);
    } finally {
      thunkApi.dispatch(setMessageLoaderOff());
    }
  }
);

const chatSlice = createSlice({
  name: "Chat Slice",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setLoaderOn: (state) => {
      state.messagesLoader = true;
    },
    setLoaderOff: (state) => {
      state.messagesLoader = false;
    },
    setMessageLoaderOn: (state) => {
      state.messageLoader = true;
    },
    setMessageLoaderOff: (state) => {
      state.messageLoader = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
    builder.addCase(setMessage.fulfilled, (state, action) => {
      state.messages = [...state.messages, action.payload];
    });
  },
});

export const {
  setUserName,
  setLoaderOn,
  setLoaderOff,
  setMessageLoaderOn,
  setMessageLoaderOff,
} = chatSlice.actions;
export default chatSlice.reducer;

const selectSelf = (state) => state.chatReducer;

export const userNameSelector = createSelector(
  selectSelf,
  (state) => state.userName
);
export const messagesLoaderSelector = createSelector(
  selectSelf,
  (state) => state.messagesLoader
);
export const messagesSelector = createSelector(
  selectSelf,
  (state) => state.messages
);
export const messageSelector = createSelector(
  selectSelf,
  (state) => state.messageLoader
);
