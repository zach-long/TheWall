// model for messages

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    content: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema);