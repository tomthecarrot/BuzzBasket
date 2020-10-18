const l = require("@samr28/log")
l.on()
l.date(false)
l.setColors({
  post: "green",
  get: "green"
});

const express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const app = express()
const port = 3000

const Redis = require('ioredis')
const redis = new Redis()

const silver = require('./silver')

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
  res.send("PONG")
})

app.get('/basketplanner', async (req, res) => {
  l.log("basketplanner", "get")
  let out = await silver.recommendBox()
  res.send(out)
})

// Get all possible baskets
app.get('/baskets', async (req, res) => {
  l.log("baskets", "get")
  // let out = await ncr.getCatalog()
  let out = [
    {itemId: 0, name: "October Spooky Coffee Basket", price: 68.98},
    {itemId: 1, name: "Coffee Gift Basket", price: 44.99},
    {itemId: 2, name: "Enthusiast Coffee Basket", price: 55.96}
  ]
  res.send(JSON.stringify(out))
})

// Order basket
app.post('/order', jsonParser, async (req, res) => {
  let itemId = req.body.itemId
  l.log(`order ${itemId}`, "post")
  let out = await silver.placeOrder(itemId)
  res.send(204)
})

app.listen(port, () => {
  l.log(`Metchant backend listening at http://localhost:${port}`, "INFO")
})