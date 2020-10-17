const l = require("@samr28/log")
l.on()
l.date(false)

const express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const app = express()
const port = 3000

const Redis = require('ioredis')
const redis = new Redis()

const id = require('./id')
id.setRedis(redis)

redis.on('connect', async () => {
  l.log('DB Connected', "INFO")

  let inv = JSON.parse(await redis.get("inv"))
  if (!Array.isArray(inv)) {
    l.log("Inv not array, resetting!", "ERROR")
    await redis.set("inv", JSON.stringify([]))
    inv = []
  }
})

app.get('/', (req, res) => {
  client.get("inv", (err, reply) => {
    if (err) throw err
    res.send(reply.toString())
  })
})

app.get('/reset', async (req, res) => {
  await redis.set("inv", JSON.stringify([]))
  await redis.set("currId", 0)
  res.send("INV CLEAR")
})

app.post('/add', jsonParser, async(req, res) => {
  body = req.body
  i = await id.gen()
  l.log(`ADD ITEM: ${body.name}:${body.qty} (id: ${i})`, "INFO")
  body.id = i

  let inv = JSON.parse(await redis.get("inv"))
  inv.push(body)
  console.log(inv)
  await redis.set("inv", JSON.stringify(inv), (err) => {
    if (err) l.log(err, "ERROR")
  })
  res.send(inv)
})

app.get('/inv', async (req, res) => {
  let inv = JSON.parse(await redis.get("inv"))
  res.send(inv)
})

app.get('/orders', async (req, res) => {
  
})

app.listen(port, () => {
  l.log(`Metchant backend listening at http://localhost:${port}`, "INFO")
})