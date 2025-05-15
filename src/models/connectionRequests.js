const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      // can restrict user to only these values.
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is Incorrect Status Type.`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
