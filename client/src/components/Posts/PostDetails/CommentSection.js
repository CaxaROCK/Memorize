import React, { useRef, useState } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";

import useStyles from "./style";
import { commentPost } from "../../../actions/posts";

function CommentSection({ post }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [comments, setComments] = useState(post?.comments);
    const [comment, setComment] = useState("");
    const user = JSON.parse(localStorage.getItem("profile"));
    const commentsRef = useRef();

    const handleClick = async () => {
        const finalComment = `${user?.user.name}: ${comment}`;
        const newComments = await dispatch(commentPost(finalComment, post._id));
        setComments(newComments);
        setComment("");

        //just scrolling down to the last comment imediately after creating one
        commentsRef.current.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">
                        Comments
                    </Typography>
                    {comments.map((c, i) => (
                        <Typography key={i} gutterBottom variant="subtitle1">
                            <strong>{c.split(": ")[0]}:</strong>
                            {c.split(":")[1]}
                        </Typography>
                    ))}
                    <div ref={commentsRef} />
                </div>
                {user?.user?.name && (
                    <div style={{ width: "70%", maxWidth: "750px" }}>
                        <Typography gutterBottom variant="h6">
                            Write a comment
                        </Typography>
                        <TextField
                            fullWidth
                            minRows={4}
                            variant="outlined"
                            label="Comment"
                            multiline
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            style={{ marginTop: "10px" }}
                            fullWidth
                            disabled={!comment}
                            variant="contained"
                            color="primary"
                            onClick={handleClick}
                        >
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentSection;
