const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const dbConnections = require('./db.Connections');
const moment = require('moment');
var lora = require('lora-packet');


server.on('message', async (msg, rinfo) => {
    console.log("msg: ", msg.toString());
    if (msg.toString()[msg.toString().length - 1] == "}") {
        var data = msg.toString().substring(
            msg.toString().lastIndexOf("[") + 1,
            msg.toString().lastIndexOf("]")
        )
        var datos = JSON.parse(data);
        var {tmst, chan, rfch, freq, stat, modu, datr, codr, lsnr, rssi, size, data} = datos;
        try {
            var packet = lora.fromWire(Buffer.from(data, 'base64'));
            var key = Buffer.from("2B7E151628AED2A6ABF7158809CF4F3C", 'hex');
            var payloadString = lora.decrypt(packet, key, key).toString('hex');
            console.log(payloadString);
            var date = new Date();
            var con = dbConnections();
            var sql = "INSERT INTO `comu` (`tmst`, `chan`, `rfch`, `freq`, `stat`, `modu`, `datr`, `codr`, `lsnr`, `rssi`, `size`, `payload`, `reg_date`) VALUES ?;";
            values = [[tmst, chan, rfch, freq, stat, modu, datr, codr, lsnr, rssi, size, payloadString, date]];
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
            con.end();

        } catch (e) {
            console.log(e)
        }

    }
});

server.bind(45826);

