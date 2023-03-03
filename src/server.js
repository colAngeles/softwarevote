require('./database/connect');
const moodleClient = require('moodle-client');
const authenticate_client = require('./modules/authenticateClient');
const Section = require('./database/models/sections');
const Candidate = require('./database/models/candidates');
const User = require('./database/models/users');
const deleteFile = require('./modules/deleteFile');
const deleteSection = require('./modules/deleteSection');
const { Server } = require('socket.io');
const { resolve } = require('path');
const multer = require('multer');
const express = require('express');
const uploadusers = require('./modules/uploadusers');
const cookieParser = require('cookie-parser');
const moodle = {
    client: null,
    create: async function () {
        this.client = await moodleClient.init({
            wwwroot: 'https://avcla.com',
            token: '260abba0f486ab4da2c6cc7c161864e7',
            strictSSL: false
        })
    }
}
moodle.create();
const upload = multer({ dest: 'src/public/uploads/' });
const app = express();
app.use(cookieParser('qnapcloud'));
app.use(express.static(resolve('src/public')));
app.get('/', (_, res) => {
    res.redirect('/login');
})
app.post('/save-vote', upload.none(), async (req, res) => {
        let {id, candidate, formula, section} = req.body;
        if (req.signedCookies.token && req.signedCookies.username) {
            try {
                let [cand, user] = await Promise.all([Candidate.findOneAndUpdate({id, candidate, formula, section}, {$inc: {votes: 1}}), User.findOneAndUpdate({username: req.signedCookies.username}, {$set: {vote: true, section}})]);
                if (cand && user) {
                    res.json({success: true});
                    return
                }
            }
            catch (e) {
                res.json({refused: true})
                return
            }  
        }
        res.redirect('/login');

})
app.get('/login', (_, res) => {
    res.clearCookie('token', {path: '/'});
    res.clearCookie('manager', { path: '/' });
    res.clearCookie('username', { path: '/' });
    res.clearCookie('sesskey', { path: '/' });
    res.sendFile(resolve('./src/public/index.html'));
})
app.get(/\/dashboard\/?(:path)?/, (req, res) => {
    if (req.signedCookies.sesskey) {
        res.sendFile(resolve('./src/public/dashboard.html'));
        return
    }
    res.redirect('/login');
})
app.get('/voter', (req, res) => {
    if (req.signedCookies.token) {
        res.sendFile(resolve('./src/public/votersignin.html'));
        return
    }
    res.redirect('/login');
})
app.get('/virtual-polling-station', (req, res) => {
        if (req.signedCookies.token && req.signedCookies.username) {
            res.sendFile(resolve('./src/public/pollingstation.html'))
            return
        }
        res.redirect('/login');
}) 
app.get('/get-sections', async (req, res, _) => {
    let data = await Section.find();
    if (data.length == 0) {
        res.json({conf: false})
        return
    }
    res.json(data)
})
app.get('/get-candidates', async (req, res) => {
    try {
        if(req.query.section) {
            let candidates = await Candidate.find({section: req.query.section});
            res.json(candidates);
            return
        }
        let candidates = await Candidate.find();
        res.json(candidates);
    }
    catch (e) {
        res.status(500).send(false);
    }
})
app.get('/candidates', async (req, res) => {
    try {
        let candidates = await Candidate.find();
        res.json(candidates);
    }
    catch (e) {
        res.status(500).send(false);
    }
})
app.get('/create-section', async (req, res) => {
    let { name } = req.query;
    try {
        let section = await Section.findOneAndUpdate({sectionName: name}, {$set: {sectionName: name}}, {upsert: true});
        res.status(200).send('ok');
    }
    catch (e) {
        res.status(500).send('error');
    }
})
app.get('/delete-candidate', async (req, res) => {
    try {
        await Candidate.remove({section: req.query.section, id: req.query.id});
        try {
            await deleteFile(resolve('./src/public/uploads/' + req.query.filename));
            res.json({success: true});
        }
        catch (e) {
            res.json({fileError: true});
        }
    }
    catch (e) {
        res.json({error: true});
    }

})
app.get('/success', (req, res) => {
    if (req.signedCookies.token && req.signedCookies.username) {
        res.clearCookie('username', {path: '/'})
        res.sendFile(resolve('./src/public/success.html'));
        return
    }
    res.redirect('/login');
}
)
app.put('/upload-users', upload.single('csvfile'), (req, res) => {
    res.json({fileName: req.file.filename});
    return
})
app.post('/save-candidate', upload.single('image'), async (req, res) => {
        let {id, section, candidate, formula} = req.body;
        try {
            let result = await Candidate.findOneAndUpdate({id, section}, {$set: {id, section: section, image: req.file.filename, candidate, formula}}, {upsert: true});
            if (result) {
                res.json({result: result, newFile: req.file.filename})
                return
            }
            res.json({success: true})
        }
        catch (e) {
            res.status(500).send('error')
        }
})
app.post('/signin-voter', upload.none(), async (req, res) => {
            let { username } = req.body
            if (req.signedCookies.manager == username) {
                res.status(301).json({redirect: true, url: 'login'});
                return
            }
            else if (req.signedCookies.token && req.signedCookies.manager) {
                try{
                    let user = await User.findOne({username: username, role: 'voter'})
                    if (user) {
                        if (!user.uservote) {
                            res.cookie('username', user.username, {signed: true});//expires: new Date(Date.now() + 480000)
                            res.json({success: true});
                        }
                        else {
                            res.json({refused: true, error: "Ya tienes un voto registrado"});
                        }
                    }
                    else {
                        res.json({refused: true, error: "El usuario no ha sido encontrado"})
                    };
                }
                catch (e){
                    console.log("No se ha podio establecer conexión con la base de datos");
                    res.json({refused: true, error: "No se ha podio establecer conexión con la base de datos"})
                }  
            }
            else {
                res.redirect('/login')
            }
})
app.post('/login', upload.none(), async (req, res) => {
    let {user: username, pass} = req.body;
    if (username == 'admin') {
        try {
            let moodleInfo = authenticate_client(moodle.client, username, pass);
                res.cookie('sesskey', moodleInfo.token, { expires: new Date(Date.now() + 4 * 3600000), signed: true});
                res.json({admin: true});
                return
        }
        catch (e) {
            res.json({refused: true, error: "Acceso inválido. Por favor, inténtelo nuevamente."})
            return
        }
    }
    try {
        let [moodleInfo, user] = await Promise.all([authenticate_client(moodle.client, username, pass), User.findOne({username: username})]);
        if (user.role == 'manager') {
            res.cookie('token', moodleInfo.token, { expires: new Date(Date.now() + 4 * 3600000), signed: true});
            res.cookie('manager', username, { expires: new Date(Date.now() + 4 * 3600000), signed: true});
            res.json({success: true, section: user.section});
            return
        }
        res.json({refused: true, error: "Acceso inválido. Por favor, inténtelo nuevamente."})
    }
    catch (e) {
        res.json({refused: true, error: "Acceso inválido. Por favor, inténtelo nuevamente."})
    }
})
let httpServer = app.listen(4000, () => {
})
let io = new Server(httpServer);
io.on('connection', ( socket ) => {
    socket.on('upload', ( fileName ) => {
        uploadusers(socket, fileName);
    })
    socket.on('delete:section', (sectionName) => {
        deleteSection(socket, sectionName);
    })
})