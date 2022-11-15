/* eslint-disable func-names */
const mongoose = require('mongoose');
const { linkValidationPattern } = require('../utils/validationRegex');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
  },
});

const linkValidator = function (value) {
  return linkValidationPattern.test(value);
};

cardSchema.path('link').validate(linkValidator, 'error');

module.exports = mongoose.model('card', cardSchema);
