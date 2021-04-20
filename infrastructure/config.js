module.exports = {
    db: {
        get connectionString() {
            const connStr = process.env.DB_CONN_STR;

            if (!connStr) {
                throw Error('DB connection string is not configured.');
            }

            return connStr;
        }
    },
    server: {
        get host() {
            return process.env.SERVER_HOST || 'localhost';
        },
        get port() {
            return +process.env.SERVER_PORT || 3000;
        }
    }
};
