import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authenManager/slice";
import { manageConsentReducer } from "./consentManager/slice";
import { manageUserReducer } from "./userManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageUser: manageUserReducer,
  manageConsent: manageConsentReducer,
});
