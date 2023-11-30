/** @type {import('next').NextConfig} */

require ('./models/connection')

const nextConfig = {
  env: {
    MONGO_DB_CONNEXION: 'mongodb+srv://crm_discord_app:Plod7-Undercoat6-Landed9-Overexert4-Bronzing2-Spooky7-Ragweed8-Persevere0-Bungee5-Hanky8@lacapsule.hssychg.mongodb.net/crmdiscord',
  },
}
  
  module.exports = nextConfig;
  