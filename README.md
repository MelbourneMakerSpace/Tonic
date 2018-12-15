Tonic - Makerspace Member Management

![Tonic Logo](https://github.com/MelbourneMakerSpace/Tonic/blob/master/src/assets/Logo.jpg?raw=true)

---

**Prerequisites Setup**

1.  Install Node.js. Install the LTS option.

2.  Open MS Code. Open terminal with Ctrl + ~.

3.  cd to your base github folder for all your different projects. When you clone it will create a new Tonic folder here.

4.  Clone the tonic project from git.

git clone https://github.com/MelbourneMakerSpace/Tonic.git

5.  cd to the base github folder/Tonic.

6.  npm install -g @angular/cli

7.  npm install -g firebase

8.  npm install

9.  that will fetch and install the packages listed in the project's package.json file.

10. ng serve

11. this will transpile the code and start up a web server on port 4200.

visit http://localhost:4200 to see the web app.

12. This project uses Google Firebase as the back end. Modify the environments.js file to use your firebase project.

---

**Firebase Database Setup**

1.  Sign up at firebase.google.com

1.  I recommend using a Google account with Gmail so you can use it as a relay. See e-mail setup below.

1.  Create a new firebase project on the main screen

1.  Go to Database and make sure Cloud Firestore is selected as your database

1.  On the project overview page, click the "Add firebase to your web app" button and copy your config information into the environment.ts file.

1.  Go to the Authentication tab in your Firebase console, and click set up sign-in method. You should enable Email/password at a minimum. Login with Google is also supported.

1.  This completes the firebase database setup.

---

**Configuring E-mail**

A firebase cloud function has to be set up in order to set e-mail. You can either use sendgrid.com to send e-mail or you can use a gmail account.

From a shell, execute this to set your **sendgrid** api key:

_Note, this costs ~10/month after your first free month._

```
firebase functions:config:set sendgridemail.apikey="YourAPIKey"
```

Execute this to set up a gmail account as a relay (limited to 500/day)

```
firebase functions:config:set gmail.email="YourEmailAddress"
firebase functions:config:set gmail.password="YourAPIKey"
```

Execute this to set up a various required variables

```
firebase functions:config:set settings.admin_email="YourEmailAddress"
firebase functions:config:set settings.from_email="YourEmailAddress"
```

**Testing Firebase Functions Locally**

In a shell, navigate to your functions directory. Use the commands below to get a copy of your current firebase variables and execute the shell. Then you can call a shell command from an API or from the shell itself

```
firebase functions:config:get > .runtimeconfig.json
firebase functions:shell
```

**Testing a web api with local functions**

```
firebase serve --only functions
```

This will give you a local server that you can use to test functions without having to keep deploying them.

**Deploy cloud functions**

During setup, you will have to deploy cloud functions to your firebase. Navigate to your firebase directory in a shell and execute

```
firebase deploy --only functions
```

Take note of the URL's provided and update your environment.ts file with the appropriate base path.

**Paypal Integration**

Tonic can use the PayPal Sync API to pull data from your organization's PayPal account to automate incoming transaction data. Read more about the api at [https://developer.paypal.com/docs/api/sync/v1/](https://developer.paypal.com/docs/api/sync/v1/)

> Written with [StackEdit](https://stackedit.io/).
