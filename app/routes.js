"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var router = express_1.default.Router();
var Message = require('./message.js');
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
    express_validator_1.body('messageContent').trim().escape(),
    express_validator_1.body('messageContent').exists().notEmpty().withMessage("You cannot post an empty message."),
    express_validator_1.body('messageContent').isLength({ max: 113213 }).withMessage("Your message is too long."),
    express_validator_1.body('messageContent').custom(function (value) {
        var emailRegex = /(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/gm;
        var containsEmail = emailRegex.test(value);
        return !containsEmail;
    }).withMessage("Your message cannot contain an email address."),
    express_validator_1.body('messageContent').custom(function (value) {
        var urlRegex = /((https?):\/\/)?([w|W]{3}\.)*[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/gm;
        var containsURL = urlRegex.test(value);
        return !containsURL;
    }).withMessage("Your message cannot contain a URL.")
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
