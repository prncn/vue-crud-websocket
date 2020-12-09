const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json()); 

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

app.listen(port, () => {
    console.log(`Sever listening to http://localhost:${port}...`)
});
