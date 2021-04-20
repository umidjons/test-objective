module.exports = (username) => {
    if (!username || !/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username)) {
        throw new Error('Invalid username');
    }

    return true;
};
