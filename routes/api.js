let express = require("express");
let router = express.Router();
let endpoint = require("../config").endpoint;
const Agent = require("agentkeepalive");
const keepAliveAgent = new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000, // active socket keepalive for 60 seconds
    freeSocketTimeout: 30000 // free socket keepalive for 30 seconds
});

let axios = require("axios");
// const axios = _axios.create({ httpAgent: keepAliveAgent });

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
    redisClient.get(`${req.cookies["private-token"]}`, (err, result) => {
        logger(`token: ${result} by ${req.cookies["private-token"]}`);
        let header = {};
        if ("1" == result) {
            header = { membership: "vip" };
            logger("vip traffic");
        } else {
            header = axios.defaults.headers.common;
        }
        axios
            .get(`${endpoint.cms}/api/content/${req.params.page}`, {
                headers: header
            })
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
});
router.get("/content/:page/:category/:include", (req, res, next) => {
    logger(`getcontent by category ${req.params.category}`);
    redisClient.get(`${req.cookies["private-token"]}`, (err, result) => {
        logger(`token: ${result} by ${req.cookies["private-token"]}`);
        let header = {};
        if ("1" == result) {
            header = { membership: "vip" };
            logger("vip traffic");
        } else {
            header = axios.defaults.headers.common;
        }
        axios
            .get(
                `${endpoint.cms}/api/content/${req.params.page}/${req.params.category}/${req.params.include}`,
                {
                    headers: header
                }
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
});
router.get("/content/:page/:category", (req, res, next) => {
    logger(`getcontent by category ${req.params.category}`);
    redisClient.get(`${req.cookies["private-token"]}`, (err, result) => {
        logger(`token: ${result} by ${req.cookies["private-token"]}`);
        let header = {};
        if ("1" == result) {
            header = { membership: "vip" };
            logger("vip traffic");
        } else {
            header = axios.defaults.headers.common;
        }
        axios
            .get(
                `${endpoint.cms}/api/content/${req.params.page}/${req.params.category}`,
                {
                    headers: header
                }
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
});
router.get("/best/:category", (req, res, next) => {
    logger(`getcontent for best by category ${req.params.category}`);
    redisClient.get(`${req.cookies["private-token"]}`, (err, result) => {
        logger(`token: ${result} by ${req.cookies["private-token"]}`);
        let header = {};
        if ("1" == result) {
            header = { membership: "vip" };
            logger("vip traffic");
        } else {
            header = axios.defaults.headers.common;
        }
        axios
            .get(`${endpoint.cms}/api/best/${req.params.category}`, {
                headers: header
            })
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
router.get("/offering", (req, res, next) => {
    logger(`getcontent for offering`);
    redisClient.get(`${req.cookies["private-token"]}`, (err, result) => {
        logger(`token: ${result} by ${req.cookies["private-token"]}`);
        let header = {};
        if ("1" == result) {
            header = { membership: "vip" };
            logger("vip traffic");
        } else {
            header = axios.defaults.headers.common;
        }
        axios
            .get(`${endpoint.cms}/api/offering`, {
                headers: header
            })
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
