const Debug = require('debug')('app:startup');
const config = require('config')
const morgan = require('morgan')
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const courses = require('./routes/courses');
const home = require('./routes/home')
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');  // default

// Built-in Middleware function
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //key=value&key=value ->req.body
app.use(express.static('public')); // static contents are served from the root of the side content
app.use(helmet()); //third party middleware
app.use('/api/courses', courses);
app.use('/', home);

// To how to set or test or see if your code is running on a development, testing, staging, or production machine.
if (app.get('env') === 'development') {
    app.use(morgan('tiny')); //third party middleware
    Debug('Morgan enabled...');
}

app.use(logger);
app.use(auth);

// Configuration
console.log('Application Name: '+ config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
