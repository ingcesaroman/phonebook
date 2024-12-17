const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

//app.use(morgan('tiny'));
morgan.token('body', (req) => {
  return JSON.stringify(req.body); 
});

app.use(morgan(':method :url :status :response-time ms :body'));

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
];

app.get('/', (request, response) => {
  response.send('Phonebook!')
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
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
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  const nameExists = persons.some(person => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' });
    console.log("error: 'name must be unique'")
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(newPerson);
  
  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 