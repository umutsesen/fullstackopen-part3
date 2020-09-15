
require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const errorHandler = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
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


let PostedPerson
app.use(errorHandler)
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })

})
app.get('/info', (req, res) => {
  const length = Object.keys(Person).length
  const nowdate = new Date()
  res.send(`Phonebook has info for ${length} people 
    ${nowdate}` )
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    person ? response.json(person) : response.status(404).end()
  })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204))
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body
  if (!body.name && !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }


  const phoneguy = new Person ({
    name: body.name,
    number: body.number
  })
  PostedPerson = JSON.stringify(phoneguy)
  phoneguy.save().then(result => {
    console.log('person saved!')
    response.json(result)
  })
    .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})