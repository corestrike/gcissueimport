# gcissueimport
This is importing tool issues to GitHub ITS from GoogleCode.


## Environment
* node.js @0.9.2
* express @3.0.0rc4
* passport @0.1.3 (<https://github.com/jaredhanson/passport>)
* passport-github @0.1.12 (<https://github.com/jaredhanson/passport-github>)
* node-github @0.1.5 (<https://github.com/ajaxorg/node-github>)


## Settings
Register from [Account Settings] > [Applications] > [Developer Application]

    Name: < Your Apps Name >
    URL: < Your Apps URL >
    CallbackURL: < Your Apps URL >/auth/github/callback

Set a Client ID and Client Secret to app.js

    /* oauth setting */
    var clientId = < Client ID >;
    var secret = < Client Secret >;


## Relation
ふが