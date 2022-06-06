import express from "express";

import {
    getPosts,
    getPost,
    getPostsBySearch,
    createPost,
    updatePost,
    deletePost,
    likePost,
    commentPost,
} from "../controllers/posts.js";

import auth from "../middleware/auth.js";

const router = express.Router();

//! IT REALLY FUCKING MATTERS HOW U PLACE THESE ROUTES
//! POSITION IT ABOVE OR BELOVE CERTAIN ONE AND IT WILL FUCK UP THE WHOLE THING

router.get("/search", getPostsBySearch); //? used for getting all existing posts and display on the main page posts
router.get("/:id", getPost); //? used for getting and displaying only one selected post
router.get("/", getPosts); //? used for getting all existing posts and display on the main page posts

router.post("/", auth, createPost); //? used for creating posts

router.patch("/:id", auth, updatePost); //? used for updating posts
router.patch("/:id/likePost", auth, likePost); //? used for updating posts
router.post("/:id/commentPost", auth, commentPost); //? used for updating posts

router.delete("/:id", auth, deletePost); //? used for deleting posts

export default router;
