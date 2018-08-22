// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBbeUVgqEft5uOP4OtUn38Ry_5qfhV5WAw",
    authDomain: "tonic-78f09.firebaseapp.com",
    databaseURL: "https://tonic-78f09.firebaseio.com",
    projectId: "tonic-78f09",
    storageBucket: "tonic-78f09.appspot.com",
    messagingSenderId: "249660708496"
  },
  firebaseFunctionURL: 'http://localhost:5000/makertonic321/us-central1/',
  firebaseFunctionURLProd:
    'https://us-central1-makertonic321.cloudfunctions.net/'
};
