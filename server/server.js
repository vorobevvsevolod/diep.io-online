const { on } = require('events');
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const crypto = require('crypto');
const os = require('os');
const pidusage = require('pidusage');
const process = require('process');

//Связка сервера и socket.io
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 3000;
//База данных
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message); else   
    console.log('Connected to the SQLite database.');
});

//Отправка сообщение на почту
const nodemailer = require('nodemailer');
const e = require('express');
const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
        user: "diepioRegistarion@yandex.ru",
        pass: "diep31122003"
    }
});

let regUsers =[];
//////////////////////////////////////////
app.use("/static", express.static(path.dirname(__dirname) + "/static"))


app.get('/admin', (req, res) =>{
    res.sendFile(path.join(__dirname, "admin.html"))
 });
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, "login.html"))
 });
////////////////////////Получение ipv4
const interfaces = os.networkInterfaces();
let ipv4;
Object.keys(interfaces).forEach(function (interfaceName) {
    interfaces[interfaceName].forEach(function (address) {
        if (address.family === 'IPv4' && !address.internal) {
            ipv4 = address.address;
        }
    });
});

server.listen(PORT, (err) =>{
    err ? console.log(err) : console.log(`Порт подключения: ${ipv4}:${PORT}`);
    settingsGames.createRectingle(settingsGames.rectingle.count);
    settingsGames.createTriangle(settingsGames.triangle.count);
    settingsGames.createPoligon(settingsGames.poligon.count);
})
/////////////////////////////////////////////
let players = [], playerAutorization = [];

let rectingle = [], triangle = [], poligon = [];
const settingsGames ={
    rectingle:{
        experience: 200,
        count: 80,
        health: 100,
        fillColor : "#ffe869", 
        strokeColor: '#bfae4e',
        speedMove: 0.1 ,
        speedRotate: 0.15
    },
    triangle: {
        experience: 400,
        count: 50,
        health: 150,
        fillColor : "#fc7677", 
        strokeColor: '#bd5859',
        speedMove: 0.07,
        speedRotate: 0.11,
    },
    poligon: {
        experience:600,
        count: 40,
        health: 300,
        fillColor : "#768dfc", 
        strokeColor : "#5869bd", 
        speedMove: 0.03,
        speedRotate: 0.10,
    },
    createRectingle(count){
        for(let i = 0; i < count; i++){
            rectingle.push({
                cordX: Math.floor(Math.random() * (3950 - 20)) + 20,
                cordY: Math.floor(Math.random() * (3950 - 20)) + 20,
                life: settingsGames.rectingle.life,
                fillColor: settingsGames.rectingle.fillColor,
                strokeColor: settingsGames.rectingle.strokeColor,

                //Доп свойства
                rotateAngle: Math.floor(Math.random() * 2) * 2 - 1,
                moveX: Math.floor(Math.random() * 2) * 2 - 1,
                moveY: Math.floor(Math.random() * 2) * 2 - 1,
                life: settingsGames.rectingle.health,
                speedMove: settingsGames.rectingle.speedMove,
                speedRotate: settingsGames.rectingle.speedRotate,
                renderPlayer: ''
            })
        }
    },
    createTriangle(count){
        for(let i = 0; i < count; i++){
            triangle.push({
                cordX: Math.floor(Math.random() * (3950 - 20)) + 20,
                cordY: Math.floor(Math.random() * (3950 - 20)) + 20,
                life: settingsGames.triangle.life,
                fillColor: settingsGames.triangle.fillColor,
                strokeColor: settingsGames.triangle.strokeColor,

                //Доп свойства
                rotateAngle: Math.floor(Math.random() * 2) * 2 - 1,
                moveX: Math.floor(Math.random() * 2) * 2 - 1,
                moveY: Math.floor(Math.random() * 2) * 2 - 1,
                life: settingsGames.triangle.health,
                speedMove: settingsGames.triangle.speedMove,
                speedRotate: settingsGames.triangle.speedRotate,
                renderPlayer: ''
            })
        }
    },
    createPoligon(count){
        for(let i = 0; i < count; i++){
            poligon.push({
                cordX: Math.floor(Math.random() * (3950 - 20)) + 20,
                cordY: Math.floor(Math.random() * (3950 - 20)) + 20,
                life: settingsGames.poligon.life,
                fillColor: settingsGames.poligon.fillColor,
                strokeColor: settingsGames.poligon.strokeColor,

                //Доп свойства
                rotateAngle: Math.floor(Math.random() * 2) * 2 - 1,
                moveX: Math.floor(Math.random() * 2) * 2 - 1,
                moveY: Math.floor(Math.random() * 2) * 2 - 1,
                life: settingsGames.poligon.health,
                speedMove: settingsGames.poligon.speedMove,
                speedRotate: settingsGames.poligon.speedRotate,
                renderPlayer: ''
            })
        }
    }
}


//Прослушка события подключения и отключения к серверу клиента
io.on('connection', (socket) => {
    socket.on("new player connected", (arg, callback)=>{
        for(let i in playerAutorization)
            if(playerAutorization[i].tokenAutorization == arg){
                let sql = `SELECT * FROM users WHERE email = ? and password = ?`;
                let values = [playerAutorization[i].email, playerAutorization[i].password]
                db.get(sql, values, (err, row) => {
                    if (err) throw err;           
                    if (row) {
                        players.push({
                            id: row.username,
                            //cordX: Math.floor(Math.random() * (3950 - 20)) + 20,
                            //cordY: Math.floor(Math.random() * (3950 - 20)) + 20
                            cordX: 10,
                            cordY: 10,
                            pushka:{
                                x: 10,
                                y: 10,
                                angle: 0,
                            },
                            bullet: [],
                            score: 4345,
                            health: 500,
                            maxHealth: 1000,
                            tokenAutorization: arg,
                            socketId: socket.id
                        });
                        callback(players, row.username, rectingle, triangle, poligon)
                        io.emit("added new players", players, row.username);
                    }
                });
            }      
    })
   
    socket.on("disconnect", () =>{
        for(let i in players) if(players[i].socketId == socket.id) {
            //Удаленние фигур после того как игрок вышел с сервера
            for(let x in rectingle)
                if(rectingle[x].renderPlayer == players[i].id) rectingle[x].renderPlayer = '';                
            for(let x in triangle)
                if(triangle[x].renderPlayer == players[i].id) triangle[x].renderPlayer = '';
  
            for(let x in poligon)
                if(poligon[x].renderPlayer == players[i].id) poligon[x].renderPlayer = '';

            io.emit('players disconnected', players[i].id, rectingle, triangle, poligon);
            players.splice(i,1);
        }
        
    });

    socket.on("movement", (x,y,id) =>{
        for(let i in players)
            if(players[i].id != id){
                
                io.emit('another igrok movement', id,x,y)
            }     
    });

    socket.on("movement figure", (object, position, name, id)=>{
        switch(name){
            case "RoundRectObject": {
                rectingle[position].x = object.x;
                rectingle[position].y = object.y;
                rectingle[position].angle = object.angle;
                rectingle[position].renderPlayer = id;
            }break;
            case 'TriangleObject': {
                triangle[position].x = object.x;
                triangle[position].y = object.y;
                triangle[position].angle = object.angle;
                triangle[position].renderPlayer = id;
            }break;
            case 'PolygonObject': {
                poligon[position].x = object.x;
                poligon[position].y = object.y;
                poligon[position].angle = object.angle;
                poligon[position].renderPlayer = id;
            }break;
        }

        io.emit("another players chenged figure", object, position, name, id)
    })

    socket.on("delete inRendering", (position, name, idPlayer)=>{
        switch(name){
            case "RoundRectObject": {
                rectingle[position].renderPlayer = '';
            }break;
            case 'TriangleObject': {
                triangle[position].renderPlayer = '';
            }break;
            case 'PolygonObject': {
                poligon[position].renderPlayer = '';
            }break;
        }

        io.emit('another delete inRendering', position, name, idPlayer);
    })

    socket.on("player movement", (id, pushkaX, pushkaY, angle, cordX, cordY)=>{
        for(let i in players)
            if(players[i].id == id){
                players[i].cordX = cordX;
                players[i].cordY = cordY;
                players[i].pushka.x = pushkaX;
                players[i].pushka.y = pushkaY;
                players[i].pushka.angle = angle;
                io.emit('athother player movement', id, pushkaX, pushkaY, angle, cordX, cordY)
            }  
    });

    socket.on('figure chenged vector', (object, position, name, idPlayer) =>{
        switch(name){
            case "RoundRectObject": {
                rectingle[position].moveX = object.moveX;
                rectingle[position].moveY = object.moveY;
                rectingle[position].rotateAngle = object.rotateAngle;

            }break;
            case 'TriangleObject': {
                triangle[position].moveX = object.moveX;
                triangle[position].moveY = object.moveY;
                triangle[position].rotateAngle = object.rotateAngle;
            }break;
            case 'PolygonObject': {
                poligon[position].moveX = object.moveX;
                poligon[position].moveY = object.moveY;
                poligon[position].rotateAngle = object.rotateAngle;
            }break;
        }

        io.emit('another chenged vector figure', object, position, name, idPlayer);
    });
    
    //io.emit('update rating', players);


    socket.on('updating health', (id, health) =>{
        for(let i in players)
            if(players[i].id == id){
                players[i].health = health;
                io.emit('another updating health', id, health);
            } 
    })

    socket.on('chenged position bullet', (bulletMass, id) =>{
        for(let i in players)
            if(players[i].id == id){
                for(let x in bulletMass){
                    players[i].bullet[x].x = bulletMass[x].x;
                    players[i].bullet[x].y = bulletMass[x].y;
                    players[i].bullet[x].life = bulletMass[x].life;
                }
                io.emit('another chenged position bullet', bulletMass, id);
            } 
                
    })

    socket.on('creating bullet', (bulletMass, id)=>{
        for(let i in players)
            if(players[i].id == id){
                players[i].bullet = bulletMass;
                io.emit('another creating bullet', bulletMass, id);
            }
    })

    socket.on('delete bullet', (position, id)=>{
        for(let i in players)
            if(players[i].id == id){
                players[i].bullet.splice(position,1);
                io.emit('another delete bullet', position, id)
            }
    })
    //База данных
    //регистрация пользователя
    socket.on('registration', (arg, callback) => {
        //Проверка есть ли пользователь в базу данных
        let sql = "SELECT * FROM users WHERE email = ?";
        let values = [arg.email];        

        db.get(sql, values, (err, row) => {
            if (err)throw err;            
            if (row) callback('Пользователь с этой почтой уже зарегистрирован'); 
             else {
                let sql = "SELECT * FROM users WHERE username = ?";
                let values = [arg.login]; 
                db.get(sql, values, (err, row) => {
                    if (err)throw err; 
                    if (row) callback('Имя занято'); 
                        else{
                            let code = generateCode();
                            let mailOptions = {
                                from: '"Diep.Io" <diepioRegistarion@yandex.ru>',
                                to: arg.email,
                                subject: "Email Verification Code",
                                text: "Your verification code is: " + code
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) console.log(error);
                                 else console.log("Email sent: " + info.response); 
                            });
                            regUsers.push({
                                name: arg.login,
                                email: arg.email,
                                password: arg.password,
                                time: arg.dataReg,
                                code: code
                            })
                            callback('Проверьте ваш email'); 
                            
                        }
                });
             };           
        });       
    });

    //Вход пользователя
    socket.on('login', (arg, callback) =>{
        let sql = "SELECT * FROM users WHERE email = ?";
        let values = [arg.email];
        let password = hashPassword(arg.password);
        db.get(sql, values, (err, row) => {
            if (err) throw err;           
            if (row) {
                if (password === row.password) {
                    if(arg.email == 'admin@mail.ru'){
                        let token = generateToken();
                        app.get(`/${token}`, (req, res) =>{
                            res.sendFile(path.join(__dirname, "admin.html"))
                        });
                        callback({response: 'Вход в систему успешен', stringConnection: `${token}`});                       
                    }else {    
                            let token = generateToken();                       
                            app.get(`/${token}`, (req, res) =>{
                                res.sendFile(path.join(__dirname, "index.html"))
                            });
                            callback({response: 'Вход в систему успешен', stringConnection: `http://${ipv4}:${PORT}/${token}`});
                            playerAutorization.push({
                                email: arg.email,
                                password: password,
                                tokenAutorization: token
                            })
                        }
                } else callback({response: 'Неверный пароль', stringConnection: ''});               
            } else callback({response: 'Пользователь не найден', stringConnection: ''});            
        });
    });

    //Проверка кода
    socket.on('validate code', (arg, callback)=>{
        for(let i in regUsers)
            if(regUsers[i].email == arg.email)
                if(regUsers[i].code == arg.code) callback('успешно')
                else callback('Неверный код');
    })

    socket.on('added in DB', (arg, callback) =>{
        for(let i in regUsers)
            if(regUsers[i].email == arg){
                let sql = "INSERT INTO users (username, email, password, create_time) VALUES (?, ?, ?, ?)";
                let password = hashPassword(regUsers[i].password);
                let values = [regUsers[i].name, regUsers[i].email, password, regUsers[i].time];

                db.run(sql, values, (err) => {                               
                    if (err) {
                        callback('ошибка'); 
                        throw err;                         
                    } else {
                        callback('успешно');               
                    } 
                });
            }else callback('Пользователь не найден')
    })

    socket.on('validate name', (arg, callback) =>{
        let sql = "SELECT * FROM users WHERE username = ?";
        let values = [arg]; 
        db.get(sql, values, (err, row) => {
            if (err)throw err; 
            if (row) callback(false); else {
                if(arg != '') callback(true); else callback(false);
            }

        })
    })


    //Сайт с информацией о сервере
    //Инфа о базе данных
    socket.on('get DB', (arg, callback) =>{
        let sql = 'SELECT * FROM users';
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows)
        });       
    })

    socket.on('added in DB SERVER', (arg, callback) =>{
        let sql = "SELECT * FROM users WHERE email = ?";
        let values = [arg.email]; 

        db.get(sql, values, (err, row) => {
            if (err)throw err;            
            if (row) callback('email уже существует'); else{
                let sql = "SELECT * FROM users WHERE username = ?";
                let values = [arg.username]; 
                db.get(sql, values, (err, row) => {
                    if (err)throw err; 
                    if (row) callback('Имя занято'); else{
                        let sql = "INSERT INTO users (username, email, password, create_time) VALUES (?, ?, ?, ?)";
                        let password = hashPassword(arg.password);
                        let values = [arg.username, arg.email, password, arg.time];
                        db.run(sql, values, (err) => {                               
                            if (err) {
                                callback('ошибка'); 
                                throw err;                         
                            } else callback('успешно');
                        });
                    }
                });
            }
        });
    })

    socket.on('delete users in DB', (arg, callback) =>{
        let sql = `DELETE FROM users WHERE id = ?`;       
        db.run(sql, arg, function(err) {
            if (err) return callback('ошибка');
             else callback('успешно');           
        });
    })

    //Инфа о игроках
    let setIntervaID;
    socket.on('get players', (flag)=>{
        if(flag){
            setIntervaID = setInterval(() => {
                io.emit('reload information players in Server', players)
            }, 50);
        }else clearInterval(setIntervaID)
        
    })

    //Инфа о загрузки сервера
    socket.on('get information cpu and memory', (arg, callback)=>{
        pidusage(process.pid).then(info => {
            let memory = (info.memory / 1024 / 1024).toFixed(2);
            let cpu = info.cpu;
            callback(cpu, memory)
        }).catch(err => {
            console.log(err);
        });
    })
});


function generateCode() {
    return Math.floor(Math.random() * 900000) + 100000;
}

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}