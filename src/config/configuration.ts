export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATA_NAME,
  },
  jwtsecret: process.env.JWT_SECRET,
  hashsalt: process.env.HASH_SALT,
});
