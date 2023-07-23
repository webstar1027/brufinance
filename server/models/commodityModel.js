const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
// Insurance Schema
const commoditiesSchema = mongoose.Schema({
    name: {
        type: String,
    },
    maName: {
        type: String,
    },
    hindiName: {
        type: String,
    },
    variants: [{ type: String }],
});

const Commodities = mongoose.model(
    'Commodities',
    commoditiesSchema,
    'commodities'
);

module.exports = Commodities;
