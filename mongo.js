
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://nuksws77:${password}@phonebook.ew1pi.mongodb.net/PhoneBook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then(persons => {
    console.log(`${persons}`)
    mongoose.connection.close()
    process.exit(1)
  })
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
}) 

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})