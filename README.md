# gcissueimport
This is importing tool issues to GitHub ITS from GoogleCode.


## Environment
* node.js @0.9.2
* express @3.0.0rc4
* ejs @0.8.3
* jsdom @0.2.15
* passport @0.1.3
* passport-github @0.1.12
* node-github @0.1.5


## Settings
Export issues from GoogleCode.

Register from [Account Settings] > [Applications] > [Developer Application]

    Name: < Your Apps Name >
    URL: < Your Apps URL >
    CallbackURL: < Your Apps URL >/auth/github/callback

Set a Client ID and Client Secret to app.js

    /* oauth setting */
    var clientId = < Client ID >;
    var secret = < Client Secret >;


## Customize

    app.js (for config)
    routes/index.js (for logic)


## Attention
When "milestone" is set to the label of GoogleCode, it imports as Milestone to GitHub. 