import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    name: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String], //this is where the array of user ids will be stored for future manipulation of likes
        default: [],
    },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
