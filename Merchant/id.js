const l = require("@samr28/log")
l.on()
l.date(false)

let redis = false

let getId = async () => parseInt(await redis.get("currId"))
// let setId = async (id) => await redis.set("currId", JSON.stringify(id))
let incId = async () => {
    let curr = await getId()
    await redis.set("currId", curr+1)
}

module.exports = {
    setRedis: async (i) => {
        redis = i
        let currId = await getId()
        if (!currId || typeof currId != "number") {
            l.log("Reset currId", "INFO")
            await redis.set("currId", 0)
        }
    },
    gen: async () => {
        let id = await getId()
        await incId()
        return id
    }
}