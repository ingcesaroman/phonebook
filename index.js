const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(cors())
app.use(express.json());
app.use(express.static('dist'))

//app.use(morgan('tiny'));
morgan.token('body', (req) => {
  return JSON.stringify(req.body); 
});

app.use(morgan(':method :url :status :response-time ms :body'));

let persons = [
];

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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const initialLength = persons.length;

  persons = persons.filter(person => person.id !== id);

  if (persons.length < initialLength) {
    response.status(204).end(); 
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
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