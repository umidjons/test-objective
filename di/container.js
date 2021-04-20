const di = require('awilix');
const ServiceSymbols = require('./symbols');
const Password = require('../modules/Password');

const container = di.createContainer();

container.register({
    [ServiceSymbols.Password]: di.asClass(Password),
});

module.exports = { di, container, ServiceSymbols, };
