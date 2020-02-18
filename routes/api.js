let express = require("express");
let router = express.Router();
let Client = require("node-rest-client").Client;
let endpoint = require("../config").endpoint;

let client = new Client();
client.registerMethod("getContent", `${endpoint.cms}/content/\${page}`, "GET");
client.registerMethod(
    "getContentByCategory",
    `${endpoint.cms}/content/\${page}/\${category}`,
    "GET"
);
client.registerMethod("getOffering", `${endpoint.cms}/offering`, "GET");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.status(200).send("index of api service");
});

router.post("/login", (req, res, next) => {
    if ("Passw0rd" === req.body.password) {
        console.log(`user: ${req.body.user}`);
        res.json({
            status: "ok"
        });
    } else {
        console.log("password should be 'Passw0rd'");
        res.json({
            status: "error",
            message: "password should be 'Passw0rd'"
        });
    }
});

router.get("/logout", (req, res, next) => {
    console.log("log out");
    res.json({
        status: "ok"
    });
});

router.get("/account", (req, res, next) => {});
router.put("/account", (req, res, next) => {});

router.get("/content/:page", (req, res, next) => {
    let args = {
        path: { page: req.params.page }
    };
    client.methods.getContent(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            res.json(data);
        }
    });
});
router.get("/content/:page/:category", (req, res, next) => {
    let args = {
        path: { page: req.params.page, category: req.params.category }
    };
    client.methods.getContentByCategory(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            res.json(data);
        }
    });
});
router.get("/offering", (req, res, next) => {
    let args = {};
    client.methods.getOffering(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            res.json(data);
        }
    });
});
module.exports = router;
