import * as functions from "firebase-functions";

export const onUserCreate = functions.auth.user().onCreate(() => {
  // Leave empty
});
