const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;

app.use(express.json());

app.get('/consumidors', (req, res) => {
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

    let consumidores = JSON.parse(fs.readFileSync('consumidores.json'));
    let user = consumidores.findIndex(consumidor => consumidor.nombre === nombre);

    consumidores[user] = nuevconsumidor;
    
    fs.writeFileSync('consumidores.json', JSON.stringify(consumidores));
    res.send("Exito");
});
/*
    para que la funcion put funcione correctamente se deven ingresar los datos de la siguiente forma
    {
    "nombre": "NombreOriginal",
    "nuevconsumidor": {
        DATOS ORIGINALES DEL USUARIO MAS LOS DATOS A MODIFICAR
    }
    }

 */

app.get('/consumidor/:name', (req, res) => {
    res.send(`Hola ${req.params.name}`);
});

/* ---------------------------------------------------------------------------------------------------------- */

app.get('/servicios', (req, res) => {
    let data = fs.readFileSync('servicios.json');
    res.send(JSON.parse(data));
});

app.post('/subirServicio', (req, res) =>{
    const nuevservicio = req.body;

    let servicio = JSON.parse(fs.readFileSync('servicios.json'));

    servicio.push(nuevservicio);
    
    fs.writeFileSync('servicios.json',  JSON.stringify(servicio));
    res.send("Exito"); 
});

app.delete('/eliminarServicio' , (req, res) => {
    const { nombre } = req.body;
    let servicio = JSON.parse(fs.readFileSync('servicios.json'));

    servicio = servicio.filter(servicio => servicio.nombre !== nombre);
    
    fs.writeFileSync('servicios.json', JSON.stringify(servicio));
    res.send("Eliminado"); 
});

app.put('/modificarServicio', (req, res) => {
    const { nombre, nuevservicio } = req.body;

    let servicio = JSON.parse(fs.readFileSync('servicios.json'));
    let user = servicio.findIndex(servicio => servicio.nombre === nombre);

    servicio[user] = nuevservicio;
    
    fs.writeFileSync('servicios.json', JSON.stringify(servicio));
    res.send("Exito");
});
/*
    para que la funcion put funcione correctamente se deven ingresar los datos de la siguiente forma
    {
    "nombre": "NombreOriginal",
    "nuevconsumidor": {
        DATOS ORIGINALES DEL USUARIO MAS LOS DATOS A MODIFICAR
    }
    }

 */

app.get('/servicio/:name', (req, res) => {
    res.send(`Hola ${req.params.name}`);
});

/* -------------------------------------------------------------------------------------------------- */

app.get('/facturas,', (req, res) => {
    let data = fs.readFileSync('facturas.json');
    res.send(JSON.parse(data));
});

app.post('/subirFactura', (req, res) =>{
    const nuevfactura = req.body;

    let factura = JSON.parse(fs.readFileSync('facturas.json'));

    factura.push(nuevfactura);
    
    fs.writeFileSync('facturas.json',  JSON.stringify(factura));
    res.send("Exito"); 
});

app.delete('/eliminarFactura' , (req, res) => {
    const { nombre } = req.body;
    let factura = JSON.parse(fs.readFileSync('facturas.json'));

    factura = factura.filter(factura => factura.nombre !== nombre);
    
    fs.writeFileSync('facturas.json', JSON.stringify(factura));
    res.send("Eliminado"); 
});

app.put('/modificarFactura', (req, res) => {
    const { nombre, nuevfactura } = req.body;

    let factura = JSON.parse(fs.readFileSync('facturas.json'));
    let user = factura.findIndex(factura => factura.nombre === nombre);

    factura[user] = nuevfactura;
    
    fs.writeFileSync('facturas.json', JSON.stringify(factura));
    res.send("Exito");
});
/*
    para que la funcion put funcione correctamente se deven ingresar los datos de la siguiente forma
    {
    "nombre": "NombreOriginal",
    "nuevconsumidor": {
        DATOS ORIGINALES DEL USUARIO MAS LOS DATOS A MODIFICAR
    }
    }

 */

app.get('/factura/:name', (req, res) => {
    res.send(`Hola ${req.params.name}`);
});

/* -------------------------------------------------------------------------------------------------------------- */

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

