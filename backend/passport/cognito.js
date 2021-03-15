var CognitoStrategy = require('passport-cognito');

module.exports = new CognitoStrategy({
        userPoolId: "us-east-2_Kw24REJR5",
        clientId: "jm80bfds5imvep1ik7t6vlv65",
        region: "arn:aws:cognito-idp:us-east-2:741637625992:userpool/us-east-2_Kw24REJR5"
    }, function(accessToken, idToken, refreshToken, user, cb) {
        process.nextTick(function() {
            cb(null, user);
        })
    }
)