//Se definen constantes ecenciales
const express = require('express');
const app = express();
const fs = require('fs');

//Se define el puerto
const port = 3000;

//Expreciones regulares para limitar contraseñas
const regularNumero = /^\d+$/;
const regularEspa = /^[0-9 ]+$/;
const regularFecha = /^[0-9\/]+$/;

//Parcea la solicitud de JSON
app.use(express.json());

//Muestra los consumidores
app.get('/consumidores', (req, res) => {
    //Funcion asincrona
    try {
        let data = JSON.parse(fs.readFileSync('consumidores.json')); //Lee el JSON
        const consumidoresActivos = data.filter(consumidor => consumidor.Activo === true); //filtra consumidores activos
        res.json(consumidoresActivos); //Muesta los consumidores activos
    } catch (error) {
        //Errores que se muestra si algo falla
        console.error("Error al leer consumidores.json:", error); 
        res.status(500).send("Error al obtener las consumidores.");
    }
});

//Muestra los consumidores por DNI
app.get('/consumidores/:dni', (req, res) => {
    const buscarDni = req.params.dni; //Obtiene el DNI de una URL espesificada
    const consumidores = JSON.parse(fs.readFileSync('consumidores.json')); //Lee el JSON
    const consumidor = consumidores.find((consumidor) => consumidor.DNI === buscarDni); //Busca el Consumidor por DNI
    if (consumidor) {
        res.json(consumidor); //Muestra el consumidor encontrado
    }else{
        res.send("Error"); //Mensaje de error
    }
});

//Agrega un nuevo consumidor
app.post('/subirConsumidor', (req, res) =>{
    const nuevconsumidor = req.body; //Obtiene un nuevo consumior de la solicitud

    //Verifica que las propiedades ingresadas existan
    const requiredFields = ['DNI', 'Nombre', 'Apellido', 'Dirección', 'Teléfono'];
    for (const field of requiredFields) {
        if (!nuevconsumidor[field]) {
            return res.status(400).send(`Error: Faltan propiedades requeridas: ${field}`);
        }
    }

    //Valida el DNI y el telefono
    if (!regularNumero.test(nuevconsumidor.DNI)) {
        return res.status(400).send("Error: El DNI debe números sin espacios");
    }
    if (!regularEspa.test(nuevconsumidor.Teléfono)) {
        return res.status(400).send("Error: El Teléfono no debe contener letras");
    }
    
    nuevconsumidor.Activo = true; // Se establece el estado de actividad como verdad
    
    let consumidor = JSON.parse(fs.readFileSync('consumidores.json')); //Lee los consumidores
    consumidor.push(nuevconsumidor); //Agrega el nuevo consumidor
    fs.writeFileSync('consumidores.json',  JSON.stringify(consumidor)); //Guarda el archivo
    res.send("Exito"); //Muestra un mesaje
});

//Modifica el estado de actividad del consumidor
app.delete('/eliminarConsumidor/:dni', (req, res) => {
    const DNI = req.params.dni; //Obtiene el DNI de una URL espesificada

    let consumidores = JSON.parse(fs.readFileSync('consumidores.json')); //Lee el JSON
    const datos = consumidores.findIndex(consumidor => consumidor.DNI === DNI); //Busca el consumidor por el DNI

    //valida la existencia del DNI
    if (datos !== -1) { 
        consumidores[datos].Activo = !consumidores[datos].Activo; //Cambia el estado de actividad
        fs.writeFileSync('consumidores.json', JSON.stringify(consumidores)); //Guarda los cambios
        //Muestra un mensaje del esta de actividad
        res.json({
            mensaje: consumidores[datos].Activo ? "Estado actualizado a verdadero" : "Estado actualizado a falso",
            Activo: consumidores[datos].Activo
        });
    } else {
        res.json({ mensaje: "No encontrado" });
    }
});

//Modifica el consumidor
app.put('/modificarConsumidor/:dni', (req, res) => {
    const DNI = req.params.dni; //Obtiene el DNI de una URL espesificada
    const nuevconsumidor = req.body; //Nuevos datos para el consumidor

    let consumidores = JSON.parse(fs.readFileSync('consumidores.json')); //Lee el archivo JSON 
    const consumidorexisten = consumidores.findIndex(consumidores => consumidores.DNI === DNI); //Valida el DNI

    //Lee la validacion del DNI
    if (consumidorexisten !== -1) { 
        consumidores[consumidorexisten] = { ...consumidores[consumidorexisten], ...nuevconsumidor }; //Actualiza el DNI
        fs.writeFileSync('consumidores.json', JSON.stringify(consumidores, null, 2)); //Guarda los cambios
        res.send("Éxito: Consumidor modificado correctamente"); //Mensaje
    } else { 
        res.status(404).json({ mensaje: "Consumidor no encontrado" }); //Mensaje de error
    }
});

/* ---------------------------------------------------------------------------------------------------------- */

app.get('/servicios', (req, res) => {
    try {
        let data = JSON.parse(fs.readFileSync('servicios.json'));
        const consumidoresActivos = data.filter((servicios) => servicios.Activo === true);
        res.json(consumidoresActivos);
    } catch (error) {
        console.error("Error al leer servicios.json:", error);
        res.status(500).send("Error al obtener las servicios.");
    }
});

app.get('/servicio/:id', (req, res) => {
    const buscarid = req.params.id;
    const servicios = JSON.parse(fs.readFileSync('servicios.json'));
    const serv = servicios.find((serv) => serv.ID === buscarid);
    if (serv) {
        res.json(serv);
    }else{
        res.send("Error");
    }
});

app.post('/subirServicio', (req, res) => {
    const nuevoserv = req.body;

    const requiredFields = ['Tipo', 'Proveedor'];
    for (const field of requiredFields) {
        if (!nuevoserv[field]) {
            return res.status(400).send(`Error: Faltan propiedades requeridas: ${field}`);
        }
    }

    nuevoserv.Activo = true; //Establece el estado Activo como verdadero por defecto
    let servicio = JSON.parse(fs.readFileSync('servicios.json')); //Lee el JSON
    const lastID = servicio.length > 0 ? servicio[servicio.length - 1].ID : 0; //Le el ID existente
    nuevoserv.ID = lastID + 1; //Le agrega 1 mas a la cadena de caracres del mismo
    servicio.push(nuevoserv); //sube el nuevo servicio
    fs.writeFileSync('servicios.json', JSON.stringify(servicio)); //Rescribe el JSON
    res.send("Exito");
});

app.delete('/eliminarServicio/:id' , (req, res) => {
    const id = req.params.id;

    let servicios = JSON.parse(fs.readFileSync('servicios.json'));
    const datos = servicios.findIndex(servicios => servicios.ID === id);

    if (datos !== -1) { 
        servicios[datos].Activo = !servicios[datos].Activo;
        fs.writeFileSync('servicios.json', JSON.stringify(servicios));
        res.json({
            mensaje: servicios[datos].Activo ? "Estado actualizado a verdadero" : "Estado actualizado a falso",
            Activo: servicios[datos].Activo
        });
    } else {
        res.json({ mensaje: "No encontrado" });
    }
});

app.put('/modificarServicio/:id', (req, res) => {
    const id = req.params.id;
    const nuevserv = req.body;

    let servicios = JSON.parse(fs.readFileSync('servicios.json'));
    const servicioexistente = servicios.findIndex(servicios => servicios.ID === id);

    if (servicioexistente !== -1) { 
        servicios[servicioexistente] = { ...servicios[servicioexistente], ...nuevserv };
        fs.writeFileSync('servicios.json', JSON.stringify(servicios, null, 2));
        res.send("Éxito: Consumidor modificado correctamente");
    } else { 
         res.status(404).json({ mensaje: "Consumidor no encontrado" });
    }
});

/* -------------------------------------------------------------------------------------------------- */

app.get('/facturas', (req, res) => {
    try {
        let data = JSON.parse(fs.readFileSync('facturas.json'));
        const facturasActivas = data.filter(factura => factura.Activo === true);
        res.json(facturasActivas);
    } catch (error) {
        console.error("Error al leer facturas.json:", error);
        res.status(500).send("Error al obtener las facturas.");
    }
});

app.get('/facturas/:facid', (req, res) => {
    const facid = req.params.facid;
    const facturas = JSON.parse(fs.readFileSync('facturas.json'));
    const fact = facturas.find(fact => fact.facID.toString() === facid.toString()); 

    if (fact) {
        res.json(fact);
    } else {
        res.status(404).send("Factura no encontrada");
    }
});

app.post('/subirFactura', (req, res) => {
    const nuevfactura = req.body;
    const ID = req.body.ServID;  //Obtiene el DNI de una URL espesificada
    const DNI = req.body.ComDNI; //Obtiene el ID de una URL espesificada

    let facturas = JSON.parse(fs.readFileSync('facturas.json'));  //Le facturas.JSON
    let servicios = JSON.parse(fs.readFileSync('servicios.json')); //Le servicios.JSON en busca del ID
    let consumidores = JSON.parse(fs.readFileSync('consumidores.json')); //Le consumidores.JSON en busca del DNI

    //Valida la existencia del ID
    const servicioexistente = servicios.find(servicio => servicio.ID === ID);
    if (!servicioexistente) {
        return res.status(400).send("Error: El servicio no existe.");
    }

    //Valida la existencia del DNI
    const consumidorexistente = consumidores.find(consumidor => consumidor.DNI === DNI);
    if (!consumidorexistente) {
        return res.status(400).send("Error: El consumidor no existe.");
    }

    const requiredFields = ['ServID', 'ComDNI', 'Monto_pagar', 'Fecha_emision','Fecha_vencimiento']; 
    for (const field of requiredFields) {
        if (nuevfactura[field] === undefined) {
            return res.status(400).send(`Error: Faltan propiedades requeridas: ${field}`);
        }
    }

    if (!regularNumero.test(nuevfactura.ComDNI)) {
        return res.status(400).send("Error: El DNI debe contener solo números sin espacios.");
    }

    if (!regularNumero.test(nuevfactura.Monto_pagar)) {
        return res.status(400).send("Error: El monto debe contener solo números sin espacios.");
    }

    if (!regularFecha.test(nuevfactura.Fecha_emision)) {
        return res.status(400).send("Error: La fecha solo deve tener numeros.");
    }

    if (!regularFecha.test(nuevfactura.Fecha_vencimiento)) {
        return res.status(400).send("Error: La fecha solo deve tener numeros.");
    }

    nuevfactura.Pagado = false;
    nuevfactura.Activo = true;

    const lastID = facturas.length > 0 ? Math.max(...facturas.map(factura => factura.facID)) : 0;
    nuevfactura.facID = lastID + 1;

    facturas.push(nuevfactura);
    fs.writeFileSync('facturas.json', JSON.stringify(facturas, null, 2));

    res.send("Exito");
});

app.delete('/eliminarFactura/:facID' , (req, res) => {
    const activo = req.params.id;

    let facturas = JSON.parse(fs.readFileSync('facturas.json'));
    const datos = facturas.findIndex(facturas => facturas.activo === activo);

    if (datos !== -1) { 
        facturas[datos].Activo = !facturas[datos].Activo;
        fs.writeFileSync('facturas.json', JSON.stringify(facturas));
        res.json({
            mensaje: facturas[datos].Activo ? "Estado actualizado a verdadero" : "Estado actualizado a falso"
        });
    } else {
        res.json({ mensaje: "No encontrado" });
    } 
});

app.put('/modificarFactura/:facid', (req, res) => {
    const facid = req.params.facid;
    const nuevfac = req.body;

    let facturas = JSON.parse(fs.readFileSync('facturas.json'));
    let servicios = JSON.parse(fs.readFileSync('servicios.json'));
    let consumidores = JSON.parse(fs.readFileSync('consumidores.json'));

    const facturaIndex = facturas.findIndex(factura => factura.facID.toString() === facid);
    if (facturaIndex === -1) {
        return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    //En caso que se dese cambiar los el ID de las facturas y el DNI hace una validacion de su existencia
    if (nuevfac.ServID) {
        const servicioExistente = servicios.find(servicio => servicio.ID === nuevfac.ServID);
        if (!servicioExistente) {
            return res.status(400).json({ mensaje: "El servicio especificado no existe" });
        }
    }
    if (nuevfac.ComDNI) {
        const consumidorExistente = consumidores.find(consumidor => consumidor.DNI === nuevfac.ComDNI);
        if (!consumidorExistente) {
            return res.status(400).json({ mensaje: "El consumidor especificado no existe" });
        }
    }

    facturas[facturaIndex] = { ...facturas[facturaIndex], ...nuevfac };
    fs.writeFileSync('facturas.json', JSON.stringify(facturas, null, 2));

    res.send("Éxito: Factura modificada correctamente");
});

/* -------------------------------------------------------------------------------------------------------------- */

//Inicia el servidor en el puerto definido
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});