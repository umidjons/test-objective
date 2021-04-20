const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body } = require('express-validator');
const validationErrorChecker = require('./validationErrorChecker');
const isValidUsername = require('./username.validator');

router

    .get('/getUsers', async (req, res) => {

        const User = mongoose.model('User');
        const users = await User.retrieveList();

        return res.json({
            users,
            // room for other useful info, e.g.: total_count, page, etc.
        });

    })

    .post('/insertUser',
        body('username').custom(isValidUsername),
        body('name', 'Invalid name')
            .isString()
            .withMessage('Name is not a string')
            .notEmpty({ ignore_whitespace: true })
            .withMessage('Name cannot be empty')
            .trim().escape(),
        body('email', 'Invalid email address').isEmail().normalizeEmail(),
        body('password', 'Not a strong password').isStrongPassword().trim(),
        validationErrorChecker,
        async (req, res, next) => {

            const userData = req.body;

            try {
                const User = mongoose.model('User');
                const newUser = await User.createNew(userData);

                return res.json({
                    user: {
                        id: newUser.id,
                    },
                    // room for the future fields
                });
            } catch (error) {
                return next(error);
            }

        });

module.exports = router;
