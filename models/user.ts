import mongodb from "mongoose";

export const User = mongodb.models.User || mongodb.model("User",
new mongodb.Schema(
	{
		_id: {
			type: String,
			required: true
		},
		username: {
		  type: String,  // Vous pouvez ajuster le type selon vos besoins
		  required: false,
		  unique: false  // Si vous voulez que les usernames soient uniques
		},
		discordId: {
			type: String,  // Vous pouvez ajuster le type selon vos besoins
			required: false,
			unique: false  // Si vous voulez que les discordId soient uniques
		  },
		// Ajoutez d'autres champs de votre schéma ici...
	} as const,
	{ _id: false },
));