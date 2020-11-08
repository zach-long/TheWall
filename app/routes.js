"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var router = express_1.default.Router();
var Message = require('./message.js');
router.get('/', function (req, res, next) {
    res.render('index');
});
router.get('/all', function (req, res, next) {
    console.log("* retrieving all Messages");
    Message.find(function (error, result) {
        if (error) {
            res.status(400).json(error);
        }
        res.status(200).json(result);
    });
});
router.post('/new', [
    express_validator_1.body('messageContent').trim().escape()
], function (req, res, next) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        console.log("* validation errors:");
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    console.log("* creating Message");
    Message.create({
        content: req.body.messageContent
    }).then(function (message) {
        console.log("* Message created successfully:");
        console.log(message);
        return res.status(201).json({ success: "Message created successfully.", message: message });
    }).catch(function (err) {
        console.log("* Message creation error");
        return res.status(400).json({ errors: err });
    });
});
module.exports = router;
