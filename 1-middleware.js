// Middleware:- 
// Concept of Middleware or Middleware function or Bunch of Middleware function
// Middleware function is basically a function that takes a request object, and 
// either returns a response to the client, or passes control to another 
// to another Middleware function. eg- Route handler function we have is 
// technically a Middleware function, coz it takes a request option, and
// in this case, it returns a response to the client, so it terminates the
// request response cycle.
// Another one is app.use(express.json()) method, this method returns a function,  
// a Middleware function. 
// The job of this Middleware function is to read the request, and if there is a json
// object in the body of the requestAnimationFrame, it will parse the body of
// the request into a json object, and then it will set request.body property. 
// So an express application is essentially nothing but a bunch of Middleware functions. 


const Joi = require('joi');
const express = require('express'); // store and load 
const app = express(); // represent our application

app.use(express.json()); // Middleware Function

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' },
]

// this method takes two arguments, first arg is url, second is callback function-
// has two arguments request, response, and this goes to code block,
app.get('/', (req, res) => { // Another Middleware function 
    res.send('Hello World')   
});

app.get('/api/courses', (req, res) =>{
    res.send(courses)
});

// GET Request
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not  found.');
    res.send(course);
});

// POST Request
application.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);  // result.error - object distructure
    if (error) return res.status(400).send(result.error.details[0].message);
        
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// PUT Request
app.put('/api/courses/:id', (req, res) =>{
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) { 
        res.status(404).send('The course with the given ID was not  found.');
        return;
    }

    // Validate
    // if invalid, return 400 - Bad request
    const { error } = validateCourse(req.body);  // result.error - object distructure
    if (error) return res.status(400).send(result.error.details[0].message);
    
    // Update course
    course.name = req.body.name;
    // Return the updated course
    res.send(course);
    
})

// DELETE Request
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // Not esisting, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not  found.');

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1)

    // Return the same course
    res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${ port }...`));


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.Validate(course, schema);
}
