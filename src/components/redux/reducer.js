import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: '',
    campId: '',
    activeStyle:''
}

const slice = createSlice({
    name: 'mySlice',
    initialState,
    reducers: {
        setValue: (state, action) => {
            state.value = action.payload;
        },
        setCamp: (state, action) => {
            state.campId = action.payload;
        },
        setactiveStyle: (state, action) => {
            state.activeStyle = action.payload;
        }
    }
})

export const { setValue, setCamp, setactiveStyle } = slice.actions;
export default slice.reducer;