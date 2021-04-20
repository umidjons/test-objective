const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
const app = require('../../app');

chai.use(chaiHttp);

describe('User module', function () {

    /**
     * @type {SuperAgentRequest}
     */
    let api = null;
    let requester = null;

    const username = 'very_weird_user_name';

    async function deleteUsers() {
        const User = mongoose.model('User');
        await User.deleteOne({ username });
    }

    context('insertUser', function () {

        beforeEach(async function () {
            requester = chai.request(app).keepOpen();
            api = requester.post('/api/insertUser').set('Cache-Control', 'no-cache');
            await deleteUsers();
        });

        afterEach(async function () {
            await deleteUsers();
            await requester.close();
        });

        after(async function () {
        });

        it('Empty body should return error', async function () {
            const res = await api.send({});

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.haveOwnProperty('error').and.not.empty;
            expect(res.body.error).matches(/Invalid username/);
        });

        it('Invalid username should return error', async function () {
            const res = await api.send({ username: '12.', });

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.haveOwnProperty('error').and.not.empty;
            expect(res.body.error).matches(/Invalid username/);
        });

        it('Valid username should succeed', async function () {
            const res = await api.send({
                username: username,
                name: 'Some User',
                email: 'some@email.com',
                password: 'VcW[)[dHX8rT.]zb',
            });

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.error).not.matches(/Invalid username/);
        });

        it('Duplicate username should not succeed', async function () {
            // Simulate user existence
            const User = mongoose.model('User');

            await User.createNew({
                username: username,
                name: 'Some User',
                email: 'some@email.com',
                password: 'VcW[)[dHX8rT.]zb',
            });

            // Send a request with the same user name
            const res = await api.send({
                username: username,
                name: 'Some Other User',
                email: 'some_other@email.com',
                password: 'aaaVcW[)[dHX8rT.]zb',
            });

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).matches(/User already exists/);
        });

        it('Numeric name should not be allowed', async function () {
            const res = await api.send({
                username: username,
                name: 123,
                email: 'some@email.com',
                password: 'VcW[)[dHX8rT.]zb',
            });

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).matches(/Name is not a string/);
        });

        it('Empty name should not be allowed', async function () {
            const res = await api.send({
                username: username,
                name: '',
                email: 'some@email.com',
                password: 'VcW[)[dHX8rT.]zb',
            });

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).matches(/Name cannot be empty/);
        });

        it('Invalid email should not be allowed', async function () {
            const res = await api.send({
                username: username,
                name: 'Some User',
                email: 'some-email.com',
                password: 'VcW[)[dHX8rT.]zb',
            });

            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body.error).matches(/Invalid email address/);
        });

        it('Valid email should pass', async function () {
            const res = await api
                .send({
                    username: username,
                    name: 'Some User',
                    email: 'some@email.com',
                    password: 'VcW[)[dHX8rT.]zb',
                });

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.error).to.be.undefined;
        });

    });

    context('getUsers', function () {

        beforeEach(async function () {
            requester = chai.request(app).keepOpen();
            api = requester.get('/api/getUsers').set('Cache-Control', 'no-cache');
            await deleteUsers();
        });

        afterEach(async function () {
            await deleteUsers();
            await requester.close();
        });

        it('No users in db, should return empty list', async function () {
            const res = await api.send();

            expect(res).to.have.status(200);
            expect(res.body).to.haveOwnProperty('users');
            expect(res.body.users).to.be.empty;
        });

        it('Should return non-empty list of users', async function () {
            // Simulate user existence
            const User = mongoose.model('User');

            await User.createNew({
                username: username,
                name: 'Some User',
                email: 'some@email.com',
                password: 'VcW[)[dHX8rT.]zb',
            });

            // Retrieve users
            const res = await api.send();

            expect(res).to.have.status(200);
            expect(res.body).to.haveOwnProperty('users');
            expect(res.body.users).to.be.lengthOf(1);
            expect(res.body.users[0].username).to.be.eql(username);
        });

    });

});
