const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb')
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
})

//---------------------[GET]---------------------

app.get('/', (req, res) => { //pagina principal
    res.status(200).end('Bienvenido a la API de Mobiliarios');
});

app.get('/mobiliario', async (req, res) => {//buscar todos los productos
    try {
        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').find().toArray()
        res.status(200).send(resultado)
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion')
    } finally {
        await disconnectFromMongoDB();
    }
})

app.get('/mobiliario/codigo/:codigo', async (req, res) => { //buscar mobiliario por codigo
    const codigoBuscado = parseInt(req.params.codigo)
    if (isNaN(codigoBuscado)) {
        return res.status(400).send('Error en el formato de codigo a buscar')
    }
    try {
        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').findOne({ codigo: codigoBuscado })
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion')
    } finally {
        await disconnectFromMongoDB();
    }
})

app.get('/mobiliario/nombre/:nombre', async (req, res) => { //buscar mobiliario por nombre
    const stringBuscado = new RegExp(req.params.nombre, 'i')
    if (!stringBuscado) {
        return res.status(400).send('Error en el formato de nombre a buscar')
    }
    try {
        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').find({ nombre: { $regex: stringBuscado } }).toArray()
        if (resultado.length === 0) {
            return res.status(200).send('La busqueda fue exitosa, pero ningun objeto contiene el string buscado');
        }
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion')
    } finally {
        await disconnectFromMongoDB();
    }
})

app.get('/mobiliario/categoria/:categoria', async (req, res) => { //buscar mobiliario por categoria
    const stringBuscado = new RegExp(req.params.categoria, 'i')
    if (!stringBuscado) {
        return res.status(400).send('Error en el formato de categoria a buscar')
    }
    try {
        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').find({ categoria: stringBuscado }).toArray()
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion')
    } finally {
        await disconnectFromMongoDB();
    }
})

//---------------------[POST]---------------------
app.post('/mobiliario', async (req, res) => { //insertar nuevo mobiliario
    const nuevoMobiliario = req.body
    if (!Object.keys(nuevoMobiliario).length) {
        return res.status(400).send('Error en el formato de datos a crear(body)')
    }

    try {
        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').insertOne(nuevoMobiliario)
        res.status(201).send(nuevoMobiliario)
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion ' + `${error.message}`)
    } finally {
        await disconnectFromMongoDB();
    }
})
//---------------------[PUT]---------------------
app.put('/mobiliario/codigo/:codigo', async (req, res) => { //modificar mobiliario por codigo [esto cambia todos los campos]
    const codigoBuscado = parseInt(req.params.codigo)
    if (!codigoBuscado) {
        return res.status(400).send('Error en el formato de codigo a buscar')
    }

    const nuevaInfo = req.body
    if (!Object.keys(nuevaInfo).length) {
        return res.status(400).send('Error en el formato de datos a crear(body)')
    }
    try {

        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').updateOne({ codigo: codigoBuscado }, { $set: nuevaInfo })
        res.status(200).send(nuevaInfo)
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion ' + `${error}`)
    } finally {
        await disconnectFromMongoDB();
    }
})

//---------------------[PATCH]---------------------
app.patch('/mobiliario/codigo/:codigo', async (req, res) => { //modificar mobiliario por codigo [esto cambia solo los campos recibidos]
    const codigoBuscado = parseInt(req.params.codigo)
    if (!codigoBuscado) {
        return res.status(400).send('Error en el formato de codigo a buscar')
    }

    const nuevaInfo = req.body
    if (!Object.keys(nuevaInfo).length) {
        return res.status(400).send('Error en el formato de datos a crear(body)')
    }
    try {

        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').updateOne({ codigo: codigoBuscado }, { $set: nuevaInfo })
        res.status(200).send(nuevaInfo)
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion ' + `${error}`)
    } finally {
        await disconnectFromMongoDB();
    }
})
//---------------------[DELETE]---------------------
app.delete('/mobiliario/codigo/:codigo', async (req, res) => { //borrar mobiliario por codigo
    const codigoBuscado = parseInt(req.params.codigo)
    if (!codigoBuscado) {
        return res.status(400).send('Error en el formato de codigo a buscar')
    }

    try {
        const client = await connectToMongoDB()
        if (!client) {
            res.status(500).send('No se pudo conectar con MongoDB')
        }
        const resultado = await client.db('mobiliario').collection('mobiliario').deleteOne({ codigo: codigoBuscado })
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send('No se pudo completar la peticion')
    } finally {
        await disconnectFromMongoDB();
    }
})


app.get('*', async (req, res) => { //ruta no encontrada
    res.status(404).send('Ruta no encontrada')
})

app.listen(PORT, () => { console.log(`API de mobiliario en puerto ${PORT}`); })
