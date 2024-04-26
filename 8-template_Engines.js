// How to convert templates to html markup?
// Templates are - pug, ejs, mustache


const Debug = require('debug')('app:startup');
const config = require('config')
const morgan = require('morgan')
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const auth = require('./auth');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');  // default

// Built-in Middleware function
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //key=value&key=value ->req.body
app.use(express.static('public')); // static contents are served from the root of the side content
app.use(helmet()); //third party middleware

// Configuration
console.log('Application Name: '+ config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

// To how to set or test or see if your code is running on a development, testing, staging, or production machine.
if (app.get('env') === 'development') {
    app.use(morgan('tiny')); //third party middleware
    Debug('Morgan enabled...');
}

app.use(logger);
app.use(auth);

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' }, 
];

// Template Engines
app.get('/', (req, res) => {
    res.render('index', { title: 'My Express App', message: 'Hello NODE.js' });
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error)  return res.status(400).send(error.details[0].message);
       
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const { error } = validateCourse(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(4).required()
    });

    return schema.validate(course);
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1); // to remove/delete an object

    res.send(course);
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
