import express, { Request, Response, NextFunction } from 'express';
import { body, Result, ValidationError, validationResult } from 'express-validator';
import { Query } from 'mongoose';
// import passport from 'passport';
const router: express.Router = express.Router();

const Message = require('./message.js');

interface MessageObject {
    content: String
}

router.get('/all',
(req: Request, res: Response, next: NextFunction) => {
    console.log(`* retrieving all Messages`);

    Message.find((error: Error, result: Query<MessageObject>) => {
        if (error) {
            res.status(400).json(error);
        }

        res.status(200).json(result);
    });
});

router.post('/new',
[
    // sanitize post
    body('messageContent').trim().escape(),
    // check that message is not blank
    body('messageContent').exists().notEmpty().withMessage(`You cannot post an empty message.`),
    // check that message is not too large
    body('messageContent').isLength({max: 113213}).withMessage(`Your message is too long.`),
    // check that message does not contain an email address
    body('messageContent').custom((value) => {
        let emailRegex = /(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/gm;
        let containsEmail = emailRegex.test(value);
        return !containsEmail;
    }).withMessage(`Your message cannot contain an email address.`),
    // check that message does not contain a url or link
    body('messageContent').custom((value) => {
        let urlRegex = /((https?):\/\/)?([w|W]{3}\.)*[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/gm;
        let containsURL = urlRegex.test(value);
        return !containsURL;
    }).withMessage(`Your message cannot contain a URL.`)
],
(req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(`* validation errors:`);
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(`* creating Message`)
    Message.create({
        content: req.body.messageContent
    }).then((message: MessageObject) => {
        console.log(`* Message created successfully:`)
        console.log(message);
        return res.status(201).json({ success: `Message created successfully.`, message: message });
    }).catch((err: any) => {
        console.log(`* Message creation error`)
        return res.status(400).json({ errors: err })
    });
});

module.exports = router;