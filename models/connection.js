//const mongodb = require("mongoose");
import mongodb from 'mongoose';

const connectionString = process.env.MONGO_DB_CONNEXION;

// handle connection
// ready states being: 0: disconnected - 1: connected - 2: connecting - 3: disconnecting
if (mongodb.connection.readyState === 1){
    console.log('crmdiscord db already connected with status : ', mongodb.connection.readyState);
} else {
    // handle connection
    mongodb.connect( connectionString, {connectTimeoutMS:2000})
    .then(() => console.log('crmdiscord db connected'))
    .catch((error) => console.log(error))
}