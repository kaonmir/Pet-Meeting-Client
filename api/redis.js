const redis = require("redis");
class Redis {
  static createClient(port, host) {
    Redis.client = redis.createClient(port, host);

    Redis.client.echo("Redis Connecting Successfully", (err, reply) => {
      if (err) console.log(err);
      else console.log(reply);
    });
  }
}

module.exports = Redis;
