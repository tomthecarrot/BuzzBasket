const l = require("@samr28/log")
l.on()
l.date(false)
// const https = require('https')
const axios = require("axios")

const orderService = "https://gateway-staging.ncrcloud.com/order/3/orders/1"
const catalogItemsService = "https://gateway-staging.ncrcloud.com/catalog/items"
const host = "gateway-staging.ncrcloud.com"

const user = "65756684-35e7-403b-a775-962c0645ccb3"
const pass = "1234zxcv@!a"
const org = "369f7ddad0ca47b0b9437b574b869444"

const options = {
    headers: {
        'Content-Type': 'application/json',
        'nep-organization': org,
        'nep-correlation-id': '2020-0708'
      },
      auth: {
          username: user,
          password: pass
      }
}

module.exports = {
    getCatalog: async () => {
        const url = `${catalogItemsService}/?codePattern=*&longDescriptionPattern=*`
        let items = []
        await axios.get(url, options)
        .then((res) => {
            let cat = res.data.pageContent
            if (!Array.isArray(cat)) {
                l.log("NCR categories response not array", "ERROR")
            } else {
                for (let item of cat) {
                    items.push({
                        itemId: item.itemId.itemCode,
                        name: item.shortDescription.value,
                        desc: item.longDescription.value
                    })
                }
            }
        })
        .catch(err => console.log(err))
        return items
    },
    placeOrder: async (itemId) => {
        const url = `${orderService}`
        let r = false
        await axios.post(url, {}, options)
        .then((res) => {
            r = res.data
        })
        .catch(err => console.log(err))
        return r
    }
}