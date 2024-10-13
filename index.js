const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;

app.use(express.json());

app.get('/consumidor', (req, res) => {
    let data = fs.readFileSync('consumidores.json');
    res.send(JSON.parse(data));
});

app.post('/subirConsumidor', (req, res) =>{
    const nuevconsumidor = req.body;

    let consumidor = JSON.parse(fs.readFileSync('consumidores.json'));

    consumidor.push(nuevconsumidor);
    
    fs.writeFileSync('consumidores.json',  JSON.stringify(consumidor));
    res.send("Exito"); 
});

app.delete('/eliminarConsumidor' , (req, res) => {
    const { nombre } = req.body;
    let consumidor = JSON.parse(fs.readFileSync('consumidores.json'));

    consumidor = consumidor.filter(consumidor => consumidor.nombre !== nombre);
    
    fs.writeFileSync('consumidores.json', JSON.stringify(consumidor));
    res.send("Eliminado"); 
});

app.put('/modificarConsumidor', (req, res) => {
    const { nombre, nuevconsumidor } = req.body;

    let consumidor = JSON.parse(fs.readFileSync('consumidores.json'));

    let index = consumidor.findIndex(consumidor => consumidor.nombre === nombre);
    if (index !== -1) {
        consumidor[index] = { ...consumidor[index], ...nuevconsumidor };
        fs.writeFileSync('consumidores.json', JSON.stringify(consumidor));
        res.send("Exito");
    }
});

app.get('/consumidor/:name', (req, res) => {
    res.send(`Hola ${req.params.name}`);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});