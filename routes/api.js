let express = require("express");
let router = express.Router();
let Client = require("node-rest-client").Client;
let endpoint = require("../config").endpoint;

let client = new Client();
logger = msg => {
    let date = new Date();
    console.log(`[sam-blackberry-api] ${date.toGMTString()}-${msg}`);
};
client.registerMethod(
    "getContent",
    `${endpoint.cms}/api/content/\${page}`,
    "GET"
);
client.registerMethod(
    "getContentByCategory",
    `${endpoint.cms}/api/content/\${page}/\${category}/\${include}`,
    "GET"
);
client.registerMethod(
    "getBestByCategory",
    `${endpoint.cms}/api/best/\${category}`,
    "GET"
);
client.registerMethod("getOffering", `${endpoint.cms}/api/offering`, "GET");

/* GET home page. */
router.get("/", function(req, res, next) {
    logger("called health check");
    res.status(200).send("index of api service");
});

router.post("/login", (req, res, next) => {
    logger(`login requested with..`);
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
    logger("log out");
    res.json({
        status: "ok"
    });
});

router.get("/account", (req, res, next) => {});
router.put("/account", (req, res, next) => {});

router.get("/content/:page", (req, res, next) => {
    let args = {
        path: { page: req.params.page },
        // headers: req.headers
    };
    client.methods.getContent(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            logger(`get ${data.length} data of ${req.params.category}`);
            res.json(data);
        }
    });
});
router.get("/content/:page/:category/:include", (req, res, next) => {
    let args = {
        path: { page: req.params.page, category: req.params.category,include:req.params.include },
        // headers: req.headers
    };
    client.methods.getContentByCategory(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            logger(`get ${data.length} data of ${req.params.category}`);
            res.json(data);
        }
    });
});
router.get("/content/:page/:category", (req, res, next) => {
    let args = {
        path: { page: req.params.page, category: req.params.category,include:true },
        // headers: req.headers
    };
    client.methods.getContentByCategory(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            logger(`get ${data.length} data of ${req.params.category}`);
            res.json(data);
        }
    });
});
router.get("/best/:category", (req, res, next) => {
    let args = {
        path: { category: req.params.category },
        // headers: req.headers
    };
    client.methods.getBestByCategory(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            logger(
                `get ${data.length} best recommand of ${req.params.category}`
            );
            res.json(data);
        }
    });
});
router.get("/offering", (req, res, next) => {
    console.log(req.headers);
    
    let args = {
        // headers: req.headers
    };
    client.methods.getOffering(args, (data, response) => {
        if (500 == response.statusCode) {
            res.status(500).json(data);
        } else {
            logger(`get ${data.length} offering data`);
            res.json(data);
        }
    });
});
module.exports = router;
