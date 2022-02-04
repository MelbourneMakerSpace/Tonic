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

7.  //no longer using firebase - ignore

8.  npm install

9.  that will fetch and install the packages listed in the project's package.json file.

10. ng serve

11. this will transpile the code and start up a web server on port 4200.

visit http://localhost:4200 to see the web app.

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
