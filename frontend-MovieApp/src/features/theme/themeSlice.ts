import { createSlice } from "@reduxjs/toolkit";

type ThemeState = boolean;

const themeFromLocalStorage = !!localStorage.getItem("movies-theme");
const initialState: ThemeState = themeFromLocalStorage;

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) =>{

            if(state){
                localStorage.removeItem("movies-theme");
            }
            else{
                localStorage.setItem("movies-theme","_");
            }
            return (state = !state)
        }
    }
})

export const {toggleTheme} = themeSlice.actions;        //This line is destructuring the actions object from the Redux slice (themeSlice). So that we can use them in our componenet to dispatch(action);
export default themeSlice.reducer;                      //This line exports the slice's reducer so that it can be used by your Redux store.