// Init Socket
const server = require('http').createServer();
const moment = require('moment');
const io = require('socket.io')(server, {
    path:'/'
});


// Init database = Mongodb

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tasksDb?replicaSet=rs');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
let countAccess = 0;

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
function getInitData(ModelLog) {
    arr = Object.keys(malwares);
    for (let i in arr) {
        ModelLog.find({ malware: arr[i] }).exec().then(function (res) {
            malwares[arr[i]] = res.length;
        });
    }
}

// Done
// Nhan connection tu Client
io.on('connection', (client) => {
  client.on('sub_AA', (att_type) => {
    console.log('client is subscribing ..', client);
    setInterval(()=>{
        client.emit(att_type, Object.values(malwares));
    }, 2000);
  });

  client.on('sub_UserAccess', (att_type) => {
    console.log('client is subscribing ..', client);
    setInterval(()=>{
        console.log(countAccess);
        client.emit(att_type, {
            newLabel:moment().format('hh:mm:ss').toString(),
            newData:countAccess
        });
        countAccess = 0;
    }, 5000);
  });
});

server.listen(8000,'192.168.0.106', () =>{
    console.log('Created');
})

///////////////////////

db.once('open', () => {
    console.log('Connect successfully to mongodb!');

    const taskCollection = db.collection('logs');
    const changeStream = taskCollection.watch();
    const accessCollection = db.collection('accessmodels');
    const changeStreamAccess = accessCollection.watch();
    const logSchema = new mongoose.Schema({
        date: Date,
        ip_src: String,
        port_src: String,
        ip_dst: String,
        port_dst: String,
        att_type: String
    });

    const Log = mongoose.model('Log', logSchema);

    getInitData(Log);

    changeStream.on('change', (change) => {
        //console.log(change);
        if (change.operationType === 'insert') {
            const task = change.fullDocument;
            switch (task.malware) {
                case 'Mirai': malwares.Mirai++;
                    break;

                case 'Bashlite': malwares.Bashlite++;
                    break;

                case 'B2': malwares.B2++;
                    break;

                case 'B4': malwares.B4++;
                    break;

                case 'B5': malwares.B5++;
                    break;

                case 'B6': malwares.B6++;
                    break;

                case 'B7': malwares.B7++;
                    break;

                case 'B8': malwares.B8++;
                    break;

                case 'B9': malwares.B9++;
                    break;
        }
        //console.log(malwares);
        //io.sockets.emit('AA', Object.values(malwares));
        }
    });

    changeStreamAccess.on('change', (change)=>{
        if (change.operationType === 'insert'){
            countAccess++;
        }
    } )
});


