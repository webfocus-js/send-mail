# Webfocus Send Mail

This is a WebfocusComponent implementation with some utilities for other [@webfocus/component](https://www.npmjs.com/package/@webfocus/component) implementations.

After registering this component the WebfocusApp instance will have the function `sendMail` defined.

## Usage

```javascript
webfocusApp.registerComponent(require("@webfocus/send-mail"))

webfocusApp.sendMail(message)
```

Its calls transport.sendMail with the message argument. (See [nodemailer message](https://nodemailer.com/message/)
