import React, { useState, useEffect } from "react";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CommentBtn from "./CommentBtn";
import { toggleDislike, toggleLike } from "src/api";

const CommentHeader = ({
  commentData,
  setReplying,
  setDeleting,
  setDeleteModalState,
  setEditing,
  time,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // State to track like/dislike counts and user mappings
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  // Track liked and disliked users (as objects where key is userId and value is user name)
  const [likedUsers, setLikedUsers] = useState({});
  const [dislikedUsers, setDislikedUsers] = useState({});

  // Check if the current user has liked or disliked
  const hasLiked = likedUsers[currentUser?.user?.id];
  const hasDisliked = dislikedUsers[currentUser?.user?.id];

  // Update state when `commentData` changes
  useEffect(() => {
    if (commentData?.companyThread) {
      setLikeCount(Object.keys(commentData.companyThread.likes || {}).length);
      setDislikeCount(Object.keys(commentData.companyThread.dislikes || {}).length);
      setLikedUsers(commentData.companyThread.likes || {});
      setDislikedUsers(commentData.companyThread.dislikes || {});
    }
  }, [commentData]);

  // Handle like toggle
  const handleLike = async () => {
    const userId = currentUser?.user?.id;
    const alreadyLiked = likedUsers[userId];

    // Update local state
    const updatedLikes = { ...likedUsers };
    if (alreadyLiked) {
      delete updatedLikes[userId];
      setLikeCount(likeCount - 1);
    } else {
      updatedLikes[userId] = `${currentUser?.user?.firstName} ${currentUser?.user?.lastName}`;
      setLikeCount(likeCount + 1);

      // Remove dislike if the user liked the thread
      if (dislikedUsers[userId]) {
        const updatedDislikes = { ...dislikedUsers };
        delete updatedDislikes[userId];
        setDislikeCount(dislikeCount - 1);
        setDislikedUsers(updatedDislikes);
      }
    }

    setLikedUsers(updatedLikes);

    // Notify the server
    await toggleLike(commentData?.companyThread?.id);
  };

  // Handle dislike toggle
  const handleDislike = async () => {
    const userId = currentUser?.user?.id;
    const alreadyDisliked = dislikedUsers[userId];

    // Update local state
    const updatedDislikes = { ...dislikedUsers };
    if (alreadyDisliked) {
      delete updatedDislikes[userId];
      setDislikeCount(dislikeCount - 1);
    } else {
      updatedDislikes[userId] = `${currentUser?.user?.firstName} ${currentUser?.user?.lastName}`;
      setDislikeCount(dislikeCount + 1);

      // Remove like if the user disliked the thread
      if (likedUsers[userId]) {
        const updatedLikes = { ...likedUsers };
        delete updatedLikes[userId];
        setLikeCount(likeCount - 1);
        setLikedUsers(updatedLikes);
      }
    }

    setDislikedUsers(updatedDislikes);

    // Notify the server
    await toggleDislike(commentData?.companyThread?.id);
  };

  return (
    <div className="comment--header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Avatar
        src={commentData?.companyThread?.User?.profilePic || ""}
        alt={commentData?.companyThread?.User?.firstName || "User Avatar"}
        sx={{ width: 40, height: 40 }}
      >
        {commentData?.companyThread?.User?.firstName
          ? commentData.companyThread.User.firstName[0]
          : "U"}
      </Avatar>
      <div>
        <div className="username" style={{ fontWeight: "bold" }}>
          {commentData?.companyThread?.User?.firstName}
        </div>
        {commentData?.companyThread?.User?.id === currentUser?.user?.id ? (
          <div className="you-tag" style={{ fontSize: "12px", color: "#ffffff" }}>You</div>
        ) : null}
      </div>
      <div className="comment-posted-time" style={{ fontSize: "12px", color: "#888" }}>
        {`${time} ago`}
      </div>

      {/* Like and Dislike Icons */}
      <div className="like-dislike-icons" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <div>
          <Tooltip title={Object.values(likedUsers).join(", ") || "No users have liked this yet"}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleLike}>
              <ThumbUp sx={{ color: hasLiked ? "#1976d2" : "#ccc" }} />
              <span style={{ marginLeft: "5px", fontSize: "14px" }}>{likeCount}</span>
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip title={Object.values(dislikedUsers).join(", ") || "No users have disliked this yet"}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleDislike}>
              <ThumbDown sx={{ color: hasDisliked ? "#d32f2f" : "#ccc" }} />
              <span style={{ marginLeft: "5px", fontSize: "14px" }}>{dislikeCount}</span>
            </div>
          </Tooltip>
        </div>
      </div>

      <CommentBtn
        commentData={commentData}
        setReplying={setReplying}
        setDeleting={setDeleting}
        setDeleteModalState={setDeleteModalState}
        setEditing={setEditing}
      />
    </div>
  );
};

export default CommentHeader;
