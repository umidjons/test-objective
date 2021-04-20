const { hash, compare } = require('bcrypt');

class Password {

    hash(password) {
        return hash(password, 10);
    }

    verify(password, hashedPassword) {
        return compare(password, hashedPassword);
    }

}

module.exports = Password;
