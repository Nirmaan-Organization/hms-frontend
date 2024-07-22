
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

const store = configureStore({
    reducer:{
        myReducer:reducer,
    }
})

export default store;