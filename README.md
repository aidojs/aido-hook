# aido-hook

Aido-hook allows you to expose a webhook to trigger Slashes or Actions on your Aido application.

## Installation

The aido-hook package can be installed with your package manager of choice :

```sh
npm install --save aido-hook
# or
yarn add aido-hook
```

To use it in your Aido application, you'll need to import it as a plugin :

```javascript
const aidoHook = require('aido-hook')

aido.init({
  plugins: [aidoHook],
})
```

## Configuration

If you want to make sure that the requests are coming from you, you can add an `aidoHookVerificationToken` to your aido configuration. If this is the case, all requests to the hook should contain `token` in their body.

## Usage

Once your server is running, you now have access to a new `/hook` route which allows you to trigger any Slash or Action configured on your Aido application. You can query this route by sending an HTTP request in the following format :

**URL**     : `https://your.aido.server/hook`

**METHOD**  : POST

**PAYLOAD** :

*To trigger a slash command :*
```javascript
{
  "token": "xxXXxxXXxx", // should be equal to your aidoHookVerificationToken if any
  "userId": "UW0TM8",    // the user to start the command for
  "command": "fnord",    // the slash command you want to trigger
  "text": "some text"    // this is the equivalent of the user typing "/fnord some text" in Slack
  "conversationWith": ["UW0TM7", "UW0TM9"], // (optional) this is used to start a Slash command in a conversation with these Slack users
  "conversationAs": "bot", // (optional) value can be "bot" or "user", depending if you want the application to impersonate you or use its own bot user
  "sessionId": "xxXXxx"    // (optional) to reuse an existing session on your application
}
```

*To trigger an action :*
```javascript
{
  "token": "xxXXxxXXxx", // should be equal to your aidoHookVerificationToken if any
  "userId": "UW0TM8",    // the user to start the command for
  "command": "fnord",    // the slash containing the action you want to trigger
  "action": "someAction" // the action you want to trigger
  "args": {              // (optional) any arguments you want to pass to the action
    "arg1": true,
    "arg2": 256
  },
  "conversationWith": ["UW0TM7", "UW0TM9"], // (optional) this is used to start a Slash command in a conversation with these Slack users
  "conversationAs": "bot", // (optional) value can be "bot" or "user", depending if you want the application to impersonate you or use its own bot user
  "sessionId": "xxXXxx"    // (optional) to reuse an existing session on your application
}
```
