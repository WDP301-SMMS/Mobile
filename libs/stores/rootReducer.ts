import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authenManager/slice";
import { manageConsentReducer } from "./consentManager/slice";
import { manageHealthCheckReducer } from "./healthCheckManager/slice";
import { manageHealthProfileReducer } from "./healthProfileManager/slice";
import { manageNotificationReducer } from "./notificationManager/slice";
import { manageUserReducer } from "./userManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageUser: manageUserReducer,
  manageConsent: manageConsentReducer,
  manageNotification: manageNotificationReducer,
  manageHealthProfile: manageHealthProfileReducer,
  manageHealthCheck: manageHealthCheckReducer,
});
