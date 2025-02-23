const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "src")));
app.use("/imagenes", express.static(path.join(__dirname, "src", "imagenes")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/description", (req, res) => {
    const provincia = req.query.provincia;
    fs.readFile(path.join(__dirname, "src", "data", "descripciones.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const descriptions = JSON.parse(data);
        if (descriptions[provincia]) {
            res.json(descriptions[provincia]);
        } else {
            res.status(404).send('Description not found');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
