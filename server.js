// Developed by Yousef Emadi
// Chat Client App Project on Node.js
// 2021-DEC

// Environment setup requirements: 
// Requirement: MongoDB, Node.js (Express js, socket io and ... ) for more information about dependencies please read dependencies block in package.json file
// mongodb remote database and collection : https://cloud.mongodb.com/v2/61b7f93855bfb8410bc30c27#metrics/replicaSet/61b7fb42f156ac5e3c64387b/explorer/db_yousef_chat_app/messages/find
// mongodb connection string: mongodb+srv://admin:admin@cluster0.gvdk3.mongodb.net/db_yousef_chat_app?retryWrites=true&w=majority

// dependencies
var express = require('express');
// necessary to parse objects to string
var bodyParser = require('body-parser');
// create an express app
var expressApp = express();

// to use socket.io features we need to tight it with express. game plan is create a http server by nod and use it for both express and socket.io
var http = require('http').Server(expressApp);
var io = require('socket.io')(http);

// Mangoose config
var mongoose = require('mongoose')
const dbUrl = "mongodb+srv://ecaterina:1q2w3e4r@cluster0.bvjan.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//port number for application
var port = 3000;

//to use index.html as home page
expressApp.use(express.static(__dirname));
//middleware
expressApp.use(bodyParser.json());
//middleware for encoding url in post method
expressApp.use(bodyParser.urlencoded({ extended: false }));

// to avoid deprecation error 
mongoose.Promise = Promise;

// create a model to use interaction to mlab via mongoose
var MessageModel = mongoose.model('Message', {
    username: String,
    message: String
});

// get handler
expressApp.get('/messages', (req, res) => {
    MessageModel.find({},(err, messages) => {
        res.send(messages)
        console.log('error code : ', err);
    })
});

// by TDD from jasmine : get handler for a specifi user's messages
expressApp.get('/messages/:user', (req, res) => {

    // to access user part of url
    var user = req.params.user;
    console.log(req);

    MessageModel.find({username: user},(err, messages) => {
        console.log(req.params.user);
        res.send(messages)
        console.log('error code : ', err);
    })
});


// post handler Ver 2 , with async/await way to have a cleaner code
// mechanism for badword: save into database, find badword, if any remove message, else emit to client
expressApp.post('/messages', async (req, res) => {
    
    try {
        // create an object based on db model
        var message = new MessageModel(req.body);
        //save the message in db with async/await
        const savedMessage = await message.save();
        console.log('saved a message from: ', message.username);
        const censoredMessage = await MessageModel.findOne({message: 'badword'});
        if (censoredMessage) {
            console.log('censoed word found to remove: ', censoredMessage); 
            await MessageModel.deleteOne({_id: censoredMessage.id})  // id auto generated by mongoose on db
        }else
            io.emit('message', req.body);
        res.sendStatus(200);

    } catch (error) {
        res.sendStatus(500);
        return console.error(err);
    }
})

io.on('connetion', (socket) => {
    console.log('a user connected');
});


mongoose.connect(dbUrl, (err) => {
    // perform actions on the collection object
    console.log('mongo db connection', err);
});


http.listen(port, () => {
    console.log(`Server is running and listening on port ${port}`);
});
