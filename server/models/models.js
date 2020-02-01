const mongoose = require('mongoose');
import { MONTHS } from '../../client/src/util/months';

const goalSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true
    },
    sticker: {
        type: String,
        default: 'star-icon'
    }
});

const daySchema = new mongoose.Schema({
    dayNumber: {
        type: Number,
        min: 1,
        max: 31,
        required: true
    },
    month: {
        type: String,
        enum: MONTHS,
        required: true
    },
    yearNumber: {
        type: Number,
        required: true
    },
    stars: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Goal'
            }
        }
    ]
});

const yearSchema = new mongoose.Schema({
    yearNumber: {
        type: Number,
        required: true
    },
    days: [ 
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Day'
            }
        }
    ]
});

exports.Goal = mongoose.model('Goal', goalSchema);
exports.Day = mongoose.model('Day', daySchema);
exports.Year = mongoose.model('Year', yearSchema);
