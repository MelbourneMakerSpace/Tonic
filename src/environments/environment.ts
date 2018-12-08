// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAfmXnoqhPT7jPhPEEnTffkp35B0JUZxuU',
    authDomain: 'makertonic321.firebaseapp.com',
    databaseURL: 'https://makertonic321.firebaseio.com',
    projectId: 'makertonic321',
    storageBucket: 'makertonic321.appspot.com',
    messagingSenderId: '382050690528'
  },
  firebaseFunctionURL: 'http://localhost:5000/makertonic321/us-central1/',
  firebaseFunctionURLProd:
    'https://us-central1-makertonic321.cloudfunctions.net/',
  SiteURL: 'http://localhost:4200',
  AdminEmail: 'cjlkegvm@sharklasers.com'
};
