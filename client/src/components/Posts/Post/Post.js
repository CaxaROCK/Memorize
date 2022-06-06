import React, { useState } from "react";
import useStyles from "./style";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    ButtonBase,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { deletePost, likePost, getPosts } from "../../../actions/posts";

function Post({ post, setCurrentId }) {
    const { search } = useLocation();

    const currentPage = parseInt(search.split(`?page=`)[1]);

    const classes = useStyles();
    const history = useHistory();

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("profile"));
    const [likes, setLikes] = useState(post?.likes); //? needed for faster UI reaction, because right now when u like something it might take 1-5 seconds to reflect on the actuall page, because we are waiting for server to update itself. but this will help to do it faster on the user end and server can do his thing in the background

    const userId = user?.user?.googleId || user?.user?._id;
    const hasLikedPost = post.likes.find((like) => like === userId);

    const handleLike = async () => {
        dispatch(likePost(post._id));
        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId));
        } else {
            setLikes([...post.likes, userId]);
        }
    };

    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === userId) ? (
                <>
                    <ThumbUpAltIcon fontSize="small" />
                    &nbsp;
                    {likes.length > 2
                        ? `You and ${likes.length - 1} others`
                        : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
                    &nbsp;
                </>
            ) : (
                <>
                    <ThumbUpOutlinedIcon fontSize="small" />
                    &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
                    &nbsp;
                </>
            );
        }

        return (
            <>
                <ThumbUpOutlinedIcon fontSize="small" />
                &nbsp;Like
            </>
        );
    };

    const openPost = () => history.push(`/posts/${post._id}`);

    return (
        <Card className={classes.card} raise="true" elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia
                    className={classes.media}
                    image={post.selectedFile}
                    title={post.title}
                />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">
                        {moment(post.createdAt).fromNow()}
                    </Typography>
                </div>

                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary">
                        {post.tags.map((tag) => ` #${tag}`)}
                    </Typography>
                </div>
                <Typography className={classes.title} variant="h5" gutterBottom>
                    {post.title}
                </Typography>
                <CardContent>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        gutterBottom
                        style={{ maxHeight: "180px", overflow: "hidden" }}
                    >
                        {post.message}
                    </Typography>
                </CardContent>
            </ButtonBase>
            {(user?.user?.googleId === post?.creator ||
                user?.user?._id === post?.creator) && (
                <div className={classes.overlay2}>
                    <Button
                        style={{ color: "white", zIndex: "15" }}
                        size="small"
                        onClick={() => setCurrentId(post._id)}
                    >
                        <MoreHorizIcon fontSize="medium" />
                    </Button>
                </div>
            )}
            <CardActions className={classes.cardActions}>
                <Button
                    size="small"
                    color="primary"
                    disabled={!user?.user}
                    onClick={handleLike}
                >
                    {/* <ThumbUpAltIcon fontSize="small" />
                    &nbsp;Like&nbsp;
                    {post.likeCount} */}
                    <Likes />
                </Button>
                {(user?.user?.googleId === post?.creator ||
                    user?.user?._id === post?.creator) && (
                    <Button
                        size="small"
                        color="primary"
                        onClick={() => (
                            dispatch(deletePost(post._id)),
                            dispatch(getPosts(currentPage)) //just to reload the page after deleting, otherwise emty space will occur
                        )}
                    >
                        <DeleteIcon fontSize="small" />
                        &nbsp;Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default Post;
