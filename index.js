const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;
const regularNumero = /^\d+$/;
const regularEspa = /^[0-9 ]+$/;

app.use(express.json());

app.get('/consumidores', (req, res) => {
    let data = fs.readFileSync('consumidores.json');
    res.send(JSON.parse(data));
});

app.get('/consumidores/:dni', (req, res) => {
    const buscarDni = req.params.dni;
    const consumidores = JSON.parse(fs.readFileSync('consumidores.json'));
    const consumidor = consumidores.find((consumidor) => consumidor.DNI === buscarDni);
    if (consumidor) {
        res.json(consumidor);
    }else{
        res.send("Error");
    }
});

app.post('/subirConsumidor', (req, res) =>{
    const nuevconsumidor = req.body;

    const requiredFields = ['DNI', 'Nombre', 'Apellido', 'Dirección', 'Teléfono','Activo'];
    for (const field of requiredFields) {
        if (!nuevconsumidor[field]) {
            return res.status(400).send(`Error: Faltan propiedades requeridas: ${field}`);
        }
    }

    if (!regularNumero.test(nuevconsumidor.DNI)) {
        return res.status(400).send("Error: El DNI debe números sin espacios");
    }

    if (!regularEspa.test(nuevconsumidor.Teléfono)) {
        return res.status(400).send("Error: El Teléfono no debe contener letras");
    }

    if (typeof nuevconsumidor.Activo !== 'boolean') {
        return res.status(400).send("Error: El Estado debe ser verdadero o falso.");
    }
    
    let consumidor = JSON.parse(fs.readFileSync('consumidores.json'));

    consumidor.push(nuevconsumidor);
    
    fs.writeFileSync('consumidores.json',  JSON.stringify(consumidor));
    res.send("Exito"); 
});

app.delete('/eliminarConsumidor/:dni', (req, res) => {
    const DNI = req.params.dni;

    let consumidores = JSON.parse(fs.readFileSync('consumidores.json'));
    const datos = consumidores.findIndex(consumidor => consumidor.DNI === DNI);

    if (datos !== -1) { 
        consumidores[datos].Activo = !consumidores[datos].Activo;
        fs.writeFileSync('consumidores.json', JSON.stringify(consumidores));
        res.json({
            mensaje: consumidores[datos].Activo ? "Estado actualizado a verdadero" : "Estado actualizado a falso",
            Activo: consumidores[datos].Activo
        });
    } else {
        res.json({ mensaje: "No encontrado" });
    }
});

app.put('/modificarConsumidor/:dni', (req, res) => {
    const DNI = req.params.dni;
    const nuevconsumidor = req.body;

    let consumidores = JSON.parse(fs.readFileSync('consumidores.json'));
    const consumidorexisten = consumidores.findIndex(consumidor => consumidor.DNI === DNI);

    if (consumidorexisten !== -1) { 
        consumidores[consumidorexisten] = { ...consumidores[consumidorexisten], ...nuevconsumidor };
        
        // Guardar en el archivo
        fs.writeFileSync('consumidores.json', JSON.stringify(consumidores, null, 2));
        res.send("Éxito: Consumidor modificado correctamente");
    } else { 
        res.status(404).json({ mensaje: "Consumidor no encontrado" });
    }
});

/* ---------------------------------------------------------------------------------------------------------- */

app.get('/servicios', (req, res) => {
    let data = fs.readFileSync('servicios.json');
    res.send(JSON.parse(data));
});

app.post('/subirServicio', (req, res) =>{
    const nuevservicio = req.body;

    const requiredFields = ['ID', 'Tipo', 'Proveedor'];
    for (const field of requiredFields) {
        if (!nuevservicio[field]) {
            return res.status(400).send(`Error: Faltan propiedades requeridas: ${field}`);
        }
    }
    
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

    const requiredFields = ['ID', 'ComDNI', 'ServID', 'Monto a pagar', 'Fecha emision', 'Fecha vencimiento', 'Pagado'];
    for (const field of requiredFields) {
        if (!nuevfactura[field]) {
            return res.status(400).send(`Error: Faltan propiedades requeridas: ${field}`);
        }
    }

    if (!regularNumero.test(nuevfactura.ComDNI)) {
        return res.status(400).send("Error: El DNI debe números sin espacios");
    }

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