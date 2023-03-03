let { unlink } = require('fs');
function deleteFile(path) {
    return new Promise((resolve, reject) => {
        unlink(path, (err) => {
            if (err) reject(false);
            resolve(true);
        });
    })
}
module.exports = deleteFile
