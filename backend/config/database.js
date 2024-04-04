const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://siddharthgogri05:Q7smy8Rvxjoz@ep-blue-paper-a1r0rejy.ap-southeast-1.aws.neon.tech/travelguide?sslmode=require"
});

client.connect();

module.exports = client;