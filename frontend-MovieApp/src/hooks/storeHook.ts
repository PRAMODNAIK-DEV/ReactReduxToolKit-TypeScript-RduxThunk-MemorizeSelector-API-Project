import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../store";

export const useAppDispatch: () => AppDispatchType = useDispatch;       //This line is creating a custom hook useAppDispatch, which is a typed version of the default useDispatch hook.
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;     //This line creates a custom hook useAppSelector, which is a typed version of the default useSelector hook. It uses a type-safe selector that knows the shape of your Redux state.
