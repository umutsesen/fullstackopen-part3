const express = require('express')
const app = express()
app.use(express.static('build'))
const morgan = require('morgan')
app.use(express.json())
const mongoose = require('mongoose')
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      PostedPerson
    ].join(' ')
  }))
const cors = require('cors')
app.use(cors())
const password = process.argv[2]  
const url = `mongodb+srv://nuksws77:${password}@phonebook.ew1pi.mongodb.net/PhoneBook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
let PostedPerson  
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
    
  })
app.get('/info', (req, res) => {
    const length = Object.keys(...persons).length
    const nowdate = new Date()
    res.send(`Phonebook has info for ${length} people 
    ${nowdate}` )
  })

app.get('/api/persons/:id', (request, response) => {
    const id = +request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.send('<h1> Not found </h1>')
        response.status(404).end()
      }
  })  


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

const checkIfExists = (name) => {
    return persons.find(person => person.name === name)

}

const generateId = () => {
    const maxId = persons.length > 0 ?
        Math.max(...persons.map(n => n.id)) :
        0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (checkIfExists(body.name)) {
        return response.status(400).json({
            error: 'name already exists'
        })  
    }

    const phoneguy = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    PostedPerson = JSON.stringify(phoneguy)
    
    persons = persons.concat(phoneguy)
    response.json(phoneguy)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})