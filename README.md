Tonic - Makerspace Member Management

![Tonic Logo](https://github.com/MelbourneMakerSpace/Tonic/blob/master/src/assets/Logo.jpg?raw=true)

This project uses Google Firebase as the back end. Modify the environments.js file to use your firebase project.

**Firebase Setup: Coming soon...**

**Configuring E-mail**
A firebase cloud function has to be set up in order to set e-mail. You can either use sendgrid.com to send e-mail or you can use a gmail account.

From a shell, execute this to set your **sendgrid** api key:
_Note, this costs ~10/month after your first free month._

    firebase functions:config:set sendgridemail.apikey="YourAPIKey"

Execute this to set up a gmail account as a relay (limited to 500/day)

    firebase functions:config:set gmail.email="YourEmailAddress"
    firebase functions:config:set gmail.password="YourAPIKey"

**Testing Firebase Functions Locally**
In a shell, navigate to your functions directory. Use the commands below to get a copy of your current firebase variables and execute the shell. Then you can call a shell command from an API or from the shell itself

    firebase functions:config:get > .runtimeconfig.json
    firebase functions:shell

**Testing a web api with local functions**

    firebase serve --only functions

This will give you a local server that you can use to test functions without having to keep deploying them.

**Deploy cloud functions**
During setup, you will have to deploy cloud functions to your firebase. Navigate to your firebase directory in a shell and execute

    firebase deploy --only functions

Take note of the URL's provided and update your environment.ts file with the appropriate base path.

> Written with [StackEdit](https://stackedit.io/).
