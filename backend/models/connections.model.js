import mongoose from "mongoose";

const connectionRequest = new mongoose.Schema({
    //who sends the request
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    //who receives the request
    connectionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    //status of the request
    status_accepted: {
        type: Boolean,
        default: null
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequest);

export default ConnectionRequest;