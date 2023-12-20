import mongoose from "mongoose";

export const Guild = mongoose.models.Guild || mongoose.model("Guild",
new mongoose.Schema(
	{
        discordId: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		icon: {
			type: String,
			required: false
		},
		permissions: {
			type: String,
			required: false
		}, 
		ownerId: {
			type: String,
			required: false
		},
        joinedTimestamp: {
			type: Number,
			required: true
		},
	}
));
