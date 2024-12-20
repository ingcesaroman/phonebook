const express = require('express');
const app = express();
require('dotenv').config();

const Person = require('./models/person')

app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json());
const morgan = require('morgan');
//app.use(morgan('tiny'));
morgan.token('body', (req) => {
  return JSON.stringify(req.body); 
});

app.use(morgan(':method :url :status :response-time ms :body'));

app.use((error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
});

const unknownEndpoint = (request, response) => {
  console.log(`Unknown endpoint: ${request.method} ${request.url}`);
  response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/', (request, response) => {
  response.send('Phonebook!')
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
});

app.get('/info', async (request, response, next) => {
  try {
    const totalPersons = await Person.countDocuments({});
    const date = new Date();

    response.send(`
      <p>Phonebook has info for ${totalPersons} people</p>
      <p>${date}</p>
    `);
  } catch (error) {
    next(error);
  }
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

app.post('/api/persons', async (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name and number are required' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    console.error('Error saving person:', error.message);
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 