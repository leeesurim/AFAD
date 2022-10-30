import {createError} from "../utils/error.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// export const addComment = async (req, res, next) => {
//   console.log(req.query.desc);
//   const newComment = new Comment(...req.body);
//   try {
//     const savedComment = await newComment.save();
//     res.status(200).send(savedComment);
//   } catch (err) {
//     next(err);
//   }
// };

//댓글작성(수정)
export const addComment = async (req, res, next) => {
  console.log(req.body);
  
  try {
    const newComment = new Comment({
      postId : req.body.postId,
      userId : req.body.userId
    });
    await newComment.save();
    res.status(200).send("댓글완성");
  } catch (err) {
    next(err);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(res.params.id);
    const post = await Post.findById(res.params.id);
    if (req.user.username === comment.userId || req.user.id === post.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted.");
    } else {
      return next(createError(403, "You can delete ony your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};