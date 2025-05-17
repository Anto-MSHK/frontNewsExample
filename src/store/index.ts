import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import newsReducer from "./slices/newsSlice";
import categoryReducer from "./slices/categorySlice";
import agencyReducer from "./slices/agencySlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    categories: categoryReducer,
    agencies: agencyReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
