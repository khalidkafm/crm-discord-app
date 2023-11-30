const mongodb = require("mongoose");

//const connectionString = process.env.MONGO_DB_CONNEXION
const connectionString = "mongodb+srv://crm_discord_app:Plod7-Undercoat6-Landed9-Overexert4-Bronzing2-Spooky7-Ragweed8-Persevere0-Bungee5-Hanky8@lacapsule.hssychg.mongodb.net/crmdiscord"

// handle connection
mongodb.connect( connectionString, {connectTimeoutMS:2000})
    .then(() => console.log('crmdiscord db connected'))
    .catch((error) => console.log(error))