const express = require("express")
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())

const router = express.Router();
app.use(router);


const calculate = (field, target) => {
    const keys = Object.keys(field)
    let res = 0;
    keys.forEach(key => {
        if (Array.isArray(field[key])) {
            if (typeof field[key][0] == 'object')
                res += calculate(field[key], target)
            else if (key == target) {
                field[key].forEach(f => res += f)
            }
        } else if (typeof field[key] == 'object')
            res += calculate(field[key], target)
        else if (key == target) {
            res += field[key]
        }
    })
    return res
}

router.post("/process", (req, res, next) => {

    const body = req.body;
    console.log(JSON.parse(body.data))

    res.send({
        "result": calculate(JSON.parse(body.data), "test")
    })
})

app.listen(3000, () => {
    console.log("Started at 3000")
})