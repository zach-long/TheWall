import express, { Request, Response, NextFunction } from 'express';
import { body, Result, ValidationError, validationResult } from 'express-validator';
import { Query } from 'mongoose';
// import passport from 'passport';
const router: express.Router = express.Router();

const Message = require('./message.js');

interface MessageObject {
    content: String
}

router.get('/',
(req: Request, res: Response, next: NextFunction) => {
    res.render('index');
});

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
    body('messageContent').trim().escape()
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