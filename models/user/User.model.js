const mongoose = require('mongoose');
const { container, ServiceSymbols } = require('../../di/container');


const UserSchema = new mongoose.Schema({
    username: { type: String, minLength: 3, maxLength: 30, required: true },
    password: { type: String, minLength: 10, required: true },
    name: { type: String, minLength: 1, maxLength: 100, required: true },
    email: { type: String, minLength: 3, maxLength: 100, required: true },
});

UserSchema.index({ username: 1 }, { name: 'username_unique', unique: true });

// Depending on the business requirements uniqueness can be set by email
// UserSchema.index({ email: 1 }, { name: 'email_unique', unique: true });

UserSchema.static('retrieveList', function () {
    return this.find({}).select('username name email').sort({ name: 1 });
});

UserSchema.static('createNew', async function (userData) {
    const found = await this.findOne({ username: userData.username });
    if (found) {
        throw new Error('User already exists');
    }

    const passwordHasher = await container.resolve(ServiceSymbols.Password);

    return this.create({
        username: userData.username,
        name: userData.name,
        email: userData.email,
        password: await passwordHasher.hash(userData.password),
    });
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = { User, UserSchema };
