const component = module.exports = require('@webfocus/component')("Email Configuration","Set email server and addresses.");
const path = require("path")
const fs = require("fs/promises");
const nodemailer = require("nodemailer")

let EMAIL_CONFIG = path.join(component.folder, "email-configuration.json");

const setMailConfig = component.setMailConfig = (config) => fs.writeFile(EMAIL_CONFIG, JSON.stringify(config))

const readMailConfig = component.readMailConfig = () => fs
    .readFile(EMAIL_CONFIG)
    .then(s => JSON.parse(s))
    .then( c => component.emailConfiguration = c )
    .catch(_ => component.emailConfiguration = {
        host: "",
        port: "",
        auth: {
            user: "",
            pass: ""
        }
    })

component.on("webfocusApp", (app) => {
    component.webfocusApp = app
    //https://nodemailer.com/message/
    app.sendMail = async (message) => {
        let transportSettings = await readMailConfig();
        let transporter = nodemailer.createTransport(transportSettings, { from: `no-reply@${transportSettings.host}` }); // Adds a default from header (overwritable)
        return transporter.sendMail(message)
    }
})

component.staticApp.get("/", (req, res, next) => {
    readMailConfig().then(_ => next()).catch(next) // Next without object otherwise it is consider an error by express.
})

component.app.post("/", (req, res, next) => {
    let settings = {
        host: req.body.host,
        port: req.body.port,
        auth: {
            user: req.body["auth.user"],
            pass: req.body["auth.pass"]
        },
        secure: "secure" in req.body
    };
    setMailConfig(settings).then(_ => res.redirect(req.referer.headers)).catch(next)
})

component.app.post("/test", (req, res, next) => {
    component.webfocusApp.sendMail({
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    }).then(_ => res.redirect(req.headers.referer)).catch(next)
})