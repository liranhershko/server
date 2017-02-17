const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // parse incoming requests
const morgan = require('morgan'); // logging middleware
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

const routesV1 = require('./routes/routesV1');

// DB setup
const uri = `mongodb://localhost:27017/${config.dbName}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

// App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

// setting routes
app.use('/v1', routesV1);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app); // creates the server from the express app
server.listen(port);
console.log('Server listening on:', port);
