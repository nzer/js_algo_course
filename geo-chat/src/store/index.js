import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import chatReducer from "./slices/chatSlice";


const persistConfig = {
  key: 'root',
  storage,
}

export const store = configureStore({
  reducer: {
    chatReducer: persistReducer(persistConfig, chatReducer),
  },
});

export const persistor = persistStore(store)