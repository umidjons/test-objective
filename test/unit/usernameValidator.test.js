const { expect } = require('chai');
const isValidUsername = require('../../modules/username.validator');

describe('username.validator', function () {

    it('empty username should not be allowed', function () {
        expect(() => isValidUsername('')).to.throw(/Invalid username/);
    });

    it('too short username should not be allowed', function () {
        expect(() => isValidUsername('ab')).to.throw(/Invalid username/);
    });

    it('too long username should not be allowed', function () {
        expect(() => isValidUsername('this_is_too_long_user_name')).to.throw(/Invalid username/);
    });

    it('username should not start with dots', function () {
        expect(() => isValidUsername('.user')).to.throw(/Invalid username/);
    });

    it('username should not start with underscore', function () {
        expect(() => isValidUsername('_user')).to.throw(/Invalid username/);
    });

    it('username should not end with dots', function () {
        expect(() => isValidUsername('user.')).to.throw(/Invalid username/);
    });

    it('username should not end with underscore', function () {
        expect(() => isValidUsername('user_')).to.throw(/Invalid username/);
    });

    it('valid username should pass', function () {
        expect(() => isValidUsername('user_2.name')).to.not.throw();
    });

});
