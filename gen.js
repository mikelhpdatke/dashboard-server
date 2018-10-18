const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tasksDb?replicaSet=rs');
const malwares = {
    'Mirai': 0,
    'Bashlite': 0,
    'B2': 0,
    'B4': 0,
    'B5': 0,
    'B6': 0,
    'B7': 0,
    'B8': 0,
    'B9': 0
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', function () {
    // we're connected!

    const logSchema = new mongoose.Schema({
        date: Date,
        ip_src: String,
        port_src: String,
        ip_dst: String,
        port_dst: String,
        att_type: String,
        malware: String
    });

    const accessSchema = new mongoose.Schema({
        user: String,
        ip: String,
        date: Date
    });

    const Log = mongoose.model('Log', logSchema);
    const AccessModel = mongoose.model('AccessModel', accessSchema);
    for (let i = 0; i < 50000; i++) {
        let log = new Log({
            date: new Date(2018, 10, 15, 10, 30, 30, 3),
            ip_src: '192.168.0.2',
            port_src: '98',
            ip_dst: '22.33.6.2',
            port_dst: '23',
            att_type: 'AA',
            malware: 'B5'
        });
        arr = Object.keys(malwares);
        //log.malware = arr[Math.floor(Math.random() * arr.length)]
        log.save((err, log) => { });
    }

    /*
    for (let i = 0; i <= 100000; i++) {
        let userAcess = new AccessModel({
            date: new Date(2018, 10, 15, 10, 30, 30, 3),
            ip: '22.33.44.2',
            user: 'admin'
        });
        userAcess.save((err, log) => {
            if (err) console.log(err);
            //234015-156738
        });
    }
    */
});
