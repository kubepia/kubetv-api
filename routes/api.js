let express = require("express");
let router = express.Router();
let Client = require("node-rest-client").Client;
let endpoint = require("../config").endpoint;

let client = new Client();
client.registerMethod("getContent", `${endpoint.cms}/content/\${id}`, "GET");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
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

router.get("/content", (req, res, next) => {
    let args = {
        path: { "id": 120 },
    };
    client.methods.getContent(args, (data, response) => {
      if(500 == response.statusCode){
        res.statusCode(500).json(data)
      }else{
        res.json(data);
      }
      
    });
});
router.get("/content/:id", (req, res, next) => {});
router.get("/contents/:page", (req, res, next) => {});
module.exports = router;
