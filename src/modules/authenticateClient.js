let request_promise = require("request-promise");
function authenticate_client(client, username, password) {
    return new Promise(function (resolve, reject) {
        client.logger.debug("[init] requesting %s token from %s", client.service, client.wwwroot);
        var options = {
            uri: client.wwwroot + "/login/token.php",
            method: "POST",
            form: {
                service: client.service,
                username: username,
                password: password
            },
            strictSSL: client.strictSSL,
            json: true
        }

        request_promise(options)
            .then(function(res) {
                if ("token" in res) {
                    client.token = res.token;
                    client.logger.debug("[init] token obtained");
                    resolve(client);
                } else if ("error" in res) {
                    client.logger.error("[init] authentication failed: " + res.error);
                    reject(new Error("authentication failed: " + res.error));
                } else {
                    client.logger.error("[init] authentication failed: unexpected server response");
                    reject(new Error("authentication failed: unexpected server response"));
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
module.exports = authenticate_client