const l = require("@samr28/log")
l.on()
l.date(false)
l.setColors({
  post: "magenta",
  get: "magenta"
});

const express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const app = express()
const port = 3000

const silver = require('./silver')

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
  let out = await silver.getBaskets()
  res.send(JSON.stringify(out))
})

// Order basket
app.post('/order', jsonParser, async (req, res) => {
  let itemId = req.body.itemMasterId
  l.log(`order ${itemId}`, "post")
  let out = await silver.placeOrder(itemId)
  res.send(out)
})

app.listen(port, () => {
  l.log(`Metchant backend listening at http://localhost:${port}`, "INFO")
})