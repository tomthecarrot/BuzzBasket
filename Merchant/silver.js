const l = require("@samr28/log")
l.on()
l.date(false)
const axios = require("axios")

const clientId = "AST00004514"
const clientSecret = "YYtcjaEa7W16H8bUwWNCocJCmeFzwFuxk2T0pDfZBLSVDNLHAffd5cHgsplLO52ipBkfaOifjPp3tSfjmUhZIwff"
const token = "gAAAAIuECC7b8uGnLJeU6zdFZbVa8Vy2Xr6zQa-YkhV7y-M9D1_v4XiOiC8qtX225m8s0aWSpfekJf4gomcojrsydmyrhP3YhseZK6ykqeKz14KvqmlusBmTNV2OG1Iqb9VjjTnPbjMstU5cAislZ59ig6QnkMBreXBKqDdG6X3lTDn09AAAAIAAAAA8QxOsqFf9l-NnRTkKbOl-DhSxMlSW21PwGsabkU_DXFn1HrQQxuX7INB6npjL7_f2SB4AOtW9CIhEMRxBMq5OeEXebi_xQjWfFryWub_OE9u-345p_XdOwcGIfeXa8Te9SSHQFaP0RQDj6kfk7CsbgwwVl7UCK2PN533BFkYVmsuwBXeZXHPTHA7IRhJ8CZsublIan0XJOzLrej4x5HNxJyTkYHAx4EoHZEgochsDlbp-gRvJxeHaSmYdcjXRVPS-oYkladuzIiK83Mh1xqGYVeuXOyleenwUJQ9hGKiM3nlYhb0jFWPDxXgVEP9qRq0"

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

const getItem = async (itemMasterId) => {
    const params = {
        item_master_id: itemMasterId
    }
    const item = await axios.get(`${host}/v2/inventory/items/item`, { headers: headers, params: params })
    if (!item || !item.data || !item.data.Result) {
        l.log("Unable to get item", "error")
        console.log(item)
        return {}
    }
    return item.data.Result
}

const getItemForOrder = async (itemMasterId) => {
    l.log(`Get item for order (masterId: ${itemMasterId})`, "info")
    let item = await getItem(itemMasterId)
    return {
        ItemId: item.ItemVariations[0].ItemId,
        ItemName: item.Name,
        Quantity: 1
    }
}

const getItemPrice = async (itemMasterId) => {
    l.log(`Get item price (masterId: ${itemMasterId})`, "info")
    let item = await getItem(itemMasterId)
    return item.RetailPrice
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
    placeOrder: async (itemMasterId) => {
        l.log("Place order", "info")
        let item = await getItemForOrder(itemMasterId)
        const order = {
            Orders: [
              {
                IsClosed: false,
                OrderNumber: "12346",
                OrderDateTime: "2020-10-17T18:24:14.049Z",
                OrderDueDateTime: "2020-10-17T18:24:14.049Z",
                IsPaid: true,
                LineItems: [ item ]
              }
            ],
            SourceApplicationName: "string"
          }
        const params = {
            store_number: 1,
            api_store_id: 1
        }
        const res = await axios.post(`${host}/v2/orders`, order, { headers: headers, params: params })
        if (!res || !res.data || !res.data.IsSuccessful) {
            l.log("Order -> NCR Silver", "error")
            console.log(res)
        } else {
            l.log("Order -> NCR", "success")
            return true
        }
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
