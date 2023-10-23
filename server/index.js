const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json()) 

app.get("/:filename", (req, res) => {
    res.download("./projects/" + req.params.filename + ".zip")
})

app.listen(4000)