let express = require("express");
let router = express.Router();
let Client = require("node-rest-client").Client;
let endpoint = require("../config").endpoint;
let axios = require("axios");
axios.defaults.baseURL = `${endpoint.cms}/api`;

const Redis = require("ioredis");
var redisClient;
if (endpoint.redis.sentinel) {
    redisClient = new Redis({
        sentinels: [endpoint.redis],
        name: "mymaster"
    });
} else {
    redisClient = new Redis({
        host: endpoint.redis.host,
        port: endpoint.redis.post
    });
}

let client = new Client();
logger = msg => {
    let date = new Date();
    console.log(`[sam-blackberry-api] ${date.toGMTString()}-${msg}`);
};
// client.registerMethod(
//     "getContent",
//     `${endpoint.cms}/api/content/\${page}`,
//     "GET"
// );
// client.registerMethod(
//     "getContentByCategory",
//     `${endpoint.cms}/api/content/\${page}/\${category}/\${include}`,
//     "GET"
// );
// client.registerMethod(
//     "getBestByCategory",
//     `${endpoint.cms}/api/best/\${category}`,
//     "GET"
// );
// client.registerMethod("getOffering", `${endpoint.cms}/api/offering`, "GET");
// client.registerMethod("login", `${endpoint.account}/api/login`, "POST");
// client.registerMethod(
//     "getUser",
//     `${endpoint.account}/api/user/\${email}`,
//     "GET"
// );
// client.registerMethod("updateUser", `${endpoint.account}/api/user`, "POST");

/* GET home page. */
router.get("/liveness", function(req, res, next) {
    logger("called liveness check");
    res.status(200).send("index of api service");
});
router.get("/readyness", function(req, res, next) {
    logger("called readyness check");
    res.status(200).send("index of api service");
});

router.post("/login", (req, res, next) => {
    logger(`login requested with..`);
    axios
        .post(`${endpoint.account}/api/login`, {
            userEmail: req.body.userEmail,
            userPW: req.body.userPW
        })
        .then(response => {
            let data = response.data;
            logger(`login ${data.userEmail}`);
            redisClient.set(`${data.userEmail}`, `${data.membership}`);
            res.cookie("private-token", data.userEmail, { httpOnly: true });
            res.status(200).json(data);
        })
        .catch(error => {
            logger(JSON.stringify(error));
            res.status(500).json(error);
        });
});

// router.get("/logout", (req, res, next) => {
//     logger("log out");
//     res.status(200).json({
//         status: "ok"
//     });
// });

router.get("/user/:email", (req, res, next) => {
    logger(`get user by ${req.params.email}`);

    axios
        .get(`${endpoint.account}/api/user/${req.params.email}`)
        .then(response => {
            let data = response.data;
            logger(`get user info of ${data.userEmail}`);
            res.status(200).json(data);
        })
        .catch(error => {
            logger(JSON.stringify(error));
            res.status(500).json(error);
        });
});
router.post("/user", (req, res, next) => {
    logger(`update user for ${req.body.userEmail}`);

    axios
        .post(`${endpoint.account}/api/user`, {
            userEmail: req.body.userEmail,
            userTel: req.body.userTel,
            userNickName: req.body.userNickName
        })
        .then(response => {
            let data = response.data;
            logger(`get user info of ${data.userEmail}`);
            res.status(200).json(data);
        })
        .catch(error => {
            logger(JSON.stringify(error));
            res.status(500).json(error);
        });
});

router.get("/content/:page", (req, res, next) => {
    logger(`getcontent ${req.params.email}`);
    axios
        .get(`${endpoint.cms}/api/content/${req.params.page}`)
        .then(response => {
            let data = response.data;
            logger(`got content`);
            res.status(200).json(data);
        })
        .catch(error => {
            logger(JSON.stringify(error));
            res.status(500).json(error);
        });
});
router.get("/content/:page/:category/:include", (req, res, next) => {
    logger(`getcontent by category ${req.params.category}`);
    axios
        .get(
            `${endpoint.cms}/api/content/${req.params.page}/${req.params.category}/${req.params.include}`
        )
        .then(response => {
            let data = response.data;
            logger(`got content`);
            res.status(200).json(data);
        })
        .catch(error => {
            logger(JSON.stringify(error));
            res.status(500).json(error);
        });
});
router.get("/content/:page/:category", (req, res, next) => {
    logger(`getcontent by category ${req.params.category}`);
    axios
        .get(
            `${endpoint.cms}/api/content/${req.params.page}/${req.params.category}`
        )
        .then(response => {
            let data = response.data;
            logger(`got content`);
            res.status(200).json(data);
        })
        .catch(error => {
            logger(JSON.stringify(error));
            res.status(500).json(error);
        });
});
router.get("/best/:category", (req, res, next) => {
    logger(`getcontent for best by category ${req.params.category}`);
    axios
        .get(
            `${endpoint.cms}/api/best/${req.params.category}`
        )
        .then(response => {
            let data = response.data;
            logger(`got best`);
            res.status(200).json(data);
        })
        .catch(error => {
            logger(JSON.stringify(error));
            res.status(500).json(error);
        });
});
router.get("/offering", (req, res, next) => {
    logger(`getcontent for offering`);
    redisClient.get(`${req.cookies["private-token"]}`, (err, result) => {
        logger(`token: ${result} by ${req.cookies["private-token"]}`);
        let header={}
        if (!!result) {
            header={membership: "vip"}
            logger("vip traffic");
        }else{
            header=axios.defaults.headers.common
        }
        axios
            .get(
                `${endpoint.cms}/api/offering`,
                {
                    headers: header
                }
            )
            .then(response => {
                let data = response.data;
                logger(`got best`);
                res.status(200).json(data);
            })
            .catch(error => {
                logger(JSON.stringify(error));
                res.status(500).json(error);
            });
    });

});
module.exports = router;
