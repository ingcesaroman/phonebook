const mongoose = require('mongoose')

/*
if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
*/
const password = process.env.MONGODB_PASSWORD;
const name = process.argv[2];
const number = process.argv[3];
  
if (!password) {
    console.log('MONGODB_PASSWORD is missing in .env file');
    process.exit(1);
  }
  
const url = `mongodb+srv://ingcesaroman:${password}@phonebookcluster0.2kwnz.mongodb.net/`

mongoose.set('strictQuery',false);

mongoose.connect(url)
    .then(() => {
    const personFormSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const PersonForm = mongoose.model('PersonForm',personFormSchema)

    const person = new PersonForm({
        name: name,
        number: number,
    })
    /*
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
    */
    PersonForm.find({}).then(result => {
        console.log('Phonebook:') 
        result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
})