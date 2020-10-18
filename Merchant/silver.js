const l = require("@samr28/log")
l.on()
l.date(false)
const axios = require("axios")

const clientId = "AST00004514"
const clientSecret = "YYtcjaEa7W16H8bUwWNCocJCmeFzwFuxk2T0pDfZBLSVDNLHAffd5cHgsplLO52ipBkfaOifjPp3tSfjmUhZIwff"
const token = "gAAAAJ5GpkO6tPyePWRkfUnKQw4QWM01DCcdMTns-YoqsVv-ZHV7yVmXx37LErOzW0LucPsJtNQtRZJx2LrB3DKbYscqPnkZ7AY1xz7eUIF60KrCNMxm4sXQWS3ctv2nYA8miAg5MpIUbIabb76fLc7qvHrxSARQLgjyz-rCcJA6Be7W9AAAAIAAAAA_KJL4q_sxensuGzXEWXdKdqVOEMwpV3UFaKGxT7_yDPlGexp_lTZRia4nmSUitawe615gb6it3I5E_3B8mjh7f9rJUfEy1wXQ8m8Gl3PG8nP7BfjIFHzM21S3_ZHEAzch5Fy-cZcbcsdZ29v0hUhmpIaNpzfSrlqWxhT4m1HGpoQxdMG9YL7H3_5I9wHZzZ9lhUvIfkb1Ih3gZwJBCRzeU29L5TmlGUvlg-HJAoNuCkrsI0zHcfzCbRehez37gKNO9qTId5gtAf0FY-aFZCx5Gw2twtY02LVyHNsKN7GMIBaA6w7xVxbbDj0f-DXUFnQ"

const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}
// https://api-reg-apigee.ncrsilverlab.com/v2/inventory/items
const host = "https://api-reg-apigee.ncrsilverlab.com"

const getInventory = async () => {
    l.log("Get inv", "info")
    const params = {
        store_number: 1,
        api_store_id: 1
    }
    const inv = await axios.get(`${host}/v2/inventory/count`, { headers: headers, params: params })
    if (!(inv && inv.data && inv.data.Result)) {
        l.log("No inv!", "error")
        console.log(inv)
    }
    const results = inv.data.Result
    let items = []
    for (let item of results) {
        if (item && item.CurrentQuantityOnHand) {
            items.push(item)
        }
    }
    items.sort((a, b) => a.CurrentQuantityOnHand - b.CurrentQuantityOnHand)
    return items
}

const getItemPrice = async (itemMasterId) => {
    l.log("Get item price", "info")
    const params = {
        item_master_id: itemMasterId
    }
    const item = await axios.get(`${host}/v2/inventory/items/item`, { headers: headers, params: params })
    if (!item || !item.data || !item.data.Result) {
        l.log("Unable to get price", "error")
        return 0
    }
    return item.data.Result.RetailPrice
}

module.exports = {
    recommendBox: async () => {
        const inventory = await getInventory()
        let nonBaskets = inventory.filter(item => !(item.ItemCategoryId === 110580))
        let yummies = []
        if (nonBaskets.length == 0) {
            l.log("Inventory len = 0", "warning")
            return []
        } else {
            while (nonBaskets.length > 0 && yummies.length < 3) {
                let curr = nonBaskets.shift()
                yummies.push({
                    itemId: curr.ItemId,
                    name: curr.ItemName,
                    itemMasterId: curr.ItemMasterId
                })
            }
        }
        // use get item request to total up the total basket cost
        return {
            items: yummies,
            totalCost: 58.94
        }
    },
    placeOrder: async (item) => {
        l.log("Place order", "info")
        // const order = {
        //     "Orders": 
        // }
        const res = await axios.post(`${host}/v2/orders`, order, { headers: headers })
    },
    getBaskets: async () => {
        l.log("Get baskets", "info")
        let inventory = await getInventory()
        let baskets = inventory.filter(item => item.ItemCategoryId === 110580)
        let retVal = []
        for (b of baskets) {
            retVal.push({
                name: b.ItemName,
                itemId: b.ItemId,
                itemMasterId: b.ItemMasterId,
                cost: await getItemPrice(b.ItemMasterId)
            })
        }
        return retVal
    }
}
