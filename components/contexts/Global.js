import React, { createContext, useContext, useReducer } from "react";
// import { DateUtils } from "../utils";

export const reducer = (state, action) => {
  switch (action.type) {
    case "switchTheme":
      return {
        ...state,
        theme: action.theme,
      };
    case "setLogOut":
      return {
        ...state,
        session: [],
      };
    case "toggleLoader":
      return {
        ...state,
        showLoader: !state.showLoader,
      };
    case "setSession":
      return {
        ...state,
        session: { ...state.session, ...action.fields },
      };
    case "setCurrency":
      return {
        ...state,
        currency: action.currency,
      };
    default:
      return {
        ...state,
      };
  }
};
export const initialState = {
  theme: "dark",
  session: [],
  locale: 'kh',
  showLoader: false,
  currency:  '$'
};
export const StateContext = createContext(initialState);
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useGlobals = () => useContext(StateContext);
