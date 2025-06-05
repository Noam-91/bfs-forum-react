import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "./store.ts";
import type {ThunkDispatch} from "@reduxjs/toolkit";
import type {UnknownAction} from "redux";

export const useThunkDispatch = useDispatch.withTypes<ThunkDispatch<RootState, unknown, UnknownAction>>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()