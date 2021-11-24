module.exports = {
  reactStrictMode: true,
  env: {
    development: {
      API_URL: "http://localhost:5000",
    },
    production: {
      //API_URL: 'https://api.sendgrid.com/v3/mail/send',
    },
  },
};
