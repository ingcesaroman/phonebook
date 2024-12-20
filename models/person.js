const mongoose = require('mongoose')

mongoose.set('strictQuery',false);

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

    const phoneValidator = {
        validator: function (value) {
          const phoneRegex = /^\d{2,3}-\d+$/; // 2-3 dígitos seguidos por "-" y más dígitos
          return phoneRegex.test(value) && value.length >= 8;
        },
        message: (props) => `${props.value} is not a valid phone number! Use format XX-XXXXXXX or XXX-XXXXXXXX.`,
      };

    const personSchema = new mongoose.Schema({
        name: {
          type: String,
          minlength: 3,
          required: true
        },
        number: {
            type: String,
            required: true,
            validate: phoneValidator,
        },
      });
      
      personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString();
          delete returnedObject._id;
          delete returnedObject.__v;
        }
      });
      
      module.exports = mongoose.model('Person', personSchema);