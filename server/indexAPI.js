require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
var io = socketio(server);

let userCount = 0;
io.on('connection', socket => {
	// console.log('User Connected.');
	// io.emit('message', 'User connected.')
	userCount++;
	socket.emit('broadcast', userCount);

  socket.on('private message', data => {
		console.log(data);
		socket.emit('message', data);
	});
	
	socket.on('disconnect', data => {
		userCount--;
		// console.log('User disconnected.');
		socket.emit('broadcast', userCount);
	});
});

app.use(cors());
app.use(express.json()); 

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const posts = require('./api/postsAPI')
app.use('/api/posts', posts);

const users = require('./api/usersAPI')
app.use('/api/users', users);

if(process.env.NODE_ENV === 'production'){
	app.use(express.static(__dirname + '/public/'));
	app.get(/.*/, (request, response) => {
		response.sendFile(__dirname + '/public/index.html')
	});
}

server.listen(port, () => {
	console.log(`Backend and Socket listening on http://localhost:${port}...`)
});
