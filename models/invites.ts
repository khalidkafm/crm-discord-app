import mongoose from "mongoose";

export const Invite = mongoose.models.Invite || mongoose.model("Invite",
new mongoose.Schema(
	{
        discordId: {
			type: String,
			required: false
		},
		code: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: false
		},
		description: {
			type: String,
			required: false
		},
		guild: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Guild',
			required: true
		},
		creator: {
			type: String,
			required: false
		},
	}
));
