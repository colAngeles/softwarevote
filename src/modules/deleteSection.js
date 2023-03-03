const { resolve } = require('path')
const Candidate = require('../database/models/candidates');
const Section = require('../database/models/sections');
const deleteFile = require('./deleteFile');
async function execDel(socket, data, length, index) {
     if (length == index) {
        let [db, file, section] = await Promise.all([Candidate.deleteOne({section: data.section, id: data.id}), deleteFile(resolve(`./src/public/uploads/${data.image}`)), Section.deleteOne({sectionName: data.section})]);
        if (db, file, section) {
            socket.emit('section:deleted', {candidate:data})
            return
        }
     }
     let [db, file] = await Promise.all([Candidate.deleteOne({section: data.section, id: data.id}), deleteFile(resolve(`./src/public/uploads/${data.image}`))]);
     socket.emit('candidate:deleted', {candidate:data})
}
function deleteSection(socket, sectionName) {
            Candidate.find({section: sectionName})
            .then(async data => {
                if (data.length == 0) {
                    try {
                        await Section.deleteOne({sectionName})
                        socket.emit('emptysection:deleted', sectionName)
                        return
                    }
                    catch (e) {
                        socket.emit('error:deletesection', sectionName);
                        return       
                    }
                }
                let length = data.length - 1
                data.forEach((val, index) => execDel(socket, val, length, index));
            })
            .catch(e => {
                socket.emit('error:deletesection', sectionName);
            });
}
module.exports = deleteSection