const express = require('express');
const app = express();
require('dotenv').config();

const Person = require('./models/person')

const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.static('dist'))

const morgan = require('morgan');
//app.use(morgan('tiny'));
morgan.token('body', (req) => {
  return JSON.stringify(req.body); 
});

app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('Phonebook!')
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
});

app.get('/info', (request, response) => {
  const totalPersons = persons.length;
  const date = new Date();

  response.send(`
    <p>Phonebook has info for ${totalPersons} people</p>
    <p>${date}</p>
  `);
});

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
  .then(person => {
      if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
  })
  .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
  .then(result => {
    response.json(result);
  })
  .catch(error => {
    console.error(error);
    response.status(500).json({ error: 'An error occurred while saving the person' });
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 