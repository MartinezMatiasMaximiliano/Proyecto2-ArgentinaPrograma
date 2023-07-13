const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URLSTRING;
const client = new MongoClient(URI)

const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log('conectado con exito');
        return client;
    } catch (error) {
        console.error('error al conectar', error);
        return null;
    }
}

const disconnectFromMongoDB = async () => {
    try {
        await client.close();
        console.log('Desconectado de MongoDB');
    } catch (error) {
        console.error('error al desconectar', error);
    }
}

module.exports = { connectToMongoDB, disconnectFromMongoDB };
