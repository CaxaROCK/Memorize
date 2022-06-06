import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

//req.query is used for: localhost/parameter/test=1&something=2
//here 'test' & 'something' are queries

//req.param is used for: localhost/posts/e12khdsnkjlfdnscdz
//here 'e12khdsnkjlfdnscdz' is a param

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8; //limit per page
        const startIndex = (Number(page) - 1) * LIMIT; //get the starting index of the every page
        const total = await PostMessage.countDocuments({}); //counts total amount of posts

        const posts = await PostMessage.find()
            .sort({ _id: -1 }) //sorts by the date (new ones first)
            .limit(LIMIT) // sets the limit to display
            .skip(startIndex); //sets how many posts we have to skip / which post will be the first one

        res.status(200).json({
            data: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT),
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i"); // 'i' here allows to ignore camel/uppercasing
        const posts = await PostMessage.find({
            $or: [{ title }, { tags: { $in: tags.split(",") } }],
            //! $or sets a condition similar to ||. since we can search by both name of the post and tag(s) we are making it so that shown result will be matching either:
            //! title or/and one/all of the tags

            //! $in sets a contidion that the item has to match at least one of the tags int the query that was sent
        });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({
        ...post,
        creator: req.userId,
        createdAt: new Date().toISOString(),
    });

    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that ID");
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
        new: true,
    });
    res.json(updatedPost);
};

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: `Unauthenticated` });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that ID");
    }

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        // like the post
        post.likes.push(req.userId);
    } else {
        // unlike the post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(
        id,
        post,
        // { likeCount: post.likeCount + 1 },
        { new: true }
    );

    res.json(updatedPost);
};

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
        new: true,
    });

    res.json(updatedPost);
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that ID");
    }

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully" });
};
