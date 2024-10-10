import { createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

type ThemeState = string;

const initialState: ThemeState = "";

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        toggleSearch(state, action){
            return state = action.payload;
        }
    }
})

export const {toggleSearch} = searchSlice.actions;
export default searchSlice.reducer;