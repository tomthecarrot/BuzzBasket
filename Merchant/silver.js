const l = require("@samr28/log")
l.on()
l.date(false)
const axios = require("axios")

const clientId = "AST00004514"
const clientSecret = "YYtcjaEa7W16H8bUwWNCocJCmeFzwFuxk2T0pDfZBLSVDNLHAffd5cHgsplLO52ipBkfaOifjPp3tSfjmUhZIwff"
const token = "gAAAAKCg_CwxpQo7zl6gGDhoKp2cduJ9J7f0TifvxbtpFZBYCSk219dDTyuGrbfvug_2DjIb9vT_Ax3jy1y78aeHu_M19Krk5aBevb8fZvIW4iM4_jhqwEgAGlKRk07JKMOILDoGs9IQr3Oq_s7xMK_JYT5OttjGyFGAwrvu4PPQxVK79AAAAIAAAACd3v15yAT3XHJ4e4mbYHd8vn42AA-OhD6TAVDV1bXVS2uKnaVeyimkzfuzarJQcvKKuwH1XCcnTQIzADb4MOFoltwpfuTmFsciccUZrmkGUOB_EVudUF4HgZtFoeDGYKEXyz-cVN-Blhm0kuPYaPrxMBg8e68KxkoK5gu5QbMQ3XA1Iwu_AncA8YpcwhRAvu_YacmmddWsDnpaDnR8yA09qvfEq5YlgOxChzLrtTQXWP_qyda-xV6Jzjtnfr0hiUIvXziZKCzvMue_aOsfm9gpOQctzQJoiIJgJnFXO5ax2aHE9svJXxOa2_xSVxC8R5g"

const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}
// https://api-reg-apigee.ncrsilverlab.com/v2/inventory/items
const host = "https://api-reg-apigee.ncrsilverlab.com"

const getInventory = async () => {
    const params = {
        store_number: 1,
        api_store_id: 1
    }
    const inv = await axios.get(`${host}/v2/inventory/count`, { headers: headers, params: params })
    l.log("Get inv", "info")
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

// const getItemPrice = async (itemMasterId) => {
//     const item
// }

module.exports = {
    recommendBox: async () => {
        const inventory = await getInventory()
        let yummies = []
        if (inventory.length == 0) {
            l.log("Inventory len = 0", "warning")
            return []
        } else {
            while (inventory.length > 0 && yummies.length < 3) {
                let curr = inventory.shift()
                yummies.push({
                    ItemId: curr.ItemId,
                    name: curr.ItemName
                })
            }
        }
        return {
            items: yummies,
            totalCost: 58.94
        }
    }
}
