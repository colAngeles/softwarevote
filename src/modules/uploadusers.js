const User = require('../database/models/users');
const parser = require('csv-parser');
const fs = require('fs');
const { resolve } = require('path');
function uploadusers(socketIo, fileName) {
    let count = 1;
    let reader = fs.createReadStream(resolve(`src/public/uploads/${fileName}`));
    reader.pipe(parser({
        separator: ';',
    })).on('data', async (data) => {
        let userData = {
            username: data['username'],
            firstname: data['firstname'],
            lastname: data['lastname'],
            role: data['role'],
            section: data['section'] || ''
        }
        try {
            let info = await User.findOneAndUpdate({'username': userData.username}, {$set: userData}, {upsert: true});
            if (info) {
                socketIo.emit('user:loaded', {success: true, count});
                count++
                return
            }
            socketIo.emit('user:loaded', {success: true, count});
            count++
            return
        }
        catch (err) {
            socketIo.emit('user:loaded', {success: false});
            count++
        }
    }).on('end', () => {
        fs.unlink(resolve(`src/public/uploads/${fileName}`), async (e) => {
                    if (e) throw e
        })
    }) 
}
module.exports = uploadusers
