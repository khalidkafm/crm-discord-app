import mongodb from "mongoose";

export const Key = mongodb.models.Key || mongodb.model("Key",
new mongodb.Schema(
	{
		_id: {
			type: String,
			required: true
		},
		user_id: {
			type: String,
			required: true
		},
		hashed_password: String
	} as const,
	{ _id: false }
));