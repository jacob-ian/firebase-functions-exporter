# Firebase Functions Exporter
A utility that quickly exports all TypeScript/JavaScript Firebase Functions from all of a directory's subdirectories.

## Usage
1. Install the package in your Firebase Functions directory (usually `/functions`):
   1. With Yarn: `yarn add firebase-functions-exporter`
   2. With NPM: `npm i --save firebase-functions-exporter`
2. Write your Firebase Functions in their own files, following the pattern `[NAME].function.ts` or `[NAME].function.js`, grouped in directories of your choosing. For example:
   1. TypeScript (with functions grouped by type):
      ```
      functions
        src
          index.ts
          callable
            updateUser.function.ts
            createUser.function.ts
          restful
            posts.function.ts
          event
            onUserCreate.function.ts
      ``` 
      `functions/src/event/onUserCreate.function.ts`:
      ```ts
      import * as functions from 'firebase-functions';

      export const onUserCreate = functions.auth.user().onCreate((user, context) => {
        functions.logger().log(`User created: ${JSON.stringify(user)}`);
      });
      ```
    1. JavaScript (with functions grouped by category):
       ```
       functions
          index.js
          users
            createUser.function.js
            updateUser.function.js
            onUserCreate.function.js
          posts
            onPostUpdate.function.js
       ```
       `functions/posts/onPostUpdate.function.js`
       ```js
       const functions = require('firebase-functions');

       exports.onPostUpdate = functions.firestore.document('/post/{postId}')
        .onUpdate((snap, context) => {
          functions.logger.log(`Post Updated: ${JSON.stringify(snap)}`);
       })
       ```
3. Define `exportFunctions` as the export in the functions index file:
   1. TypeScript:
      `functions/src/index.ts`: 
      ```ts
      import { exportFunctions } from 'firebase-functions-exporter';

      module.exports = exportFunctions();
      ```
    1. JavaScript: `functions/index.js`:
        ```js
        const { exportFunctions } = require('firebase-functions-exporter');

        module.exports = exportFunctions()
        ``` 
4. Deploy to Firebase Functions:
   `firebase deploy --only functions`.

## Notes
- If using default exports, the function will take the name of the file, i.e. the name of a default exported function in the file `onUserCreate.function.ts` will be `onUserCreate`.
- Deploying to Firebase Functions will fail if two or more functions have the same name.

## Licence
MIT