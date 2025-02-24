import { useEffect, useState } from "react";

import "./Styles/Comment.scss";

import { commentPostedTime } from "../utils";
import CommentHeader from "./CommentHeader";
import AddComment from "./AddComment";

const Replies = ({ threadData }) => {
  const [replying, setReplying] = useState(false);
  const [time, setTime] = useState("");
  const [vote, setVoted] = useState(false);
  const [score, setScore] = useState(threadData.companyThread?.id);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(threadData?.companyThread?.message);
  const [deleting, setDeleting] = useState(false);
  const [DeleteModalState, setDeleteModalState] = useState(false);

  // get time from comment posted
  const createdAt = new Date(threadData.companyThread?.createdAt);
  const today = new Date();
  const differenceInTime = today.getTime() - createdAt.getTime();

  useEffect(() => {
    setTime(commentPostedTime(differenceInTime));
  }, [differenceInTime, vote]);

  const addReply = (newReply) => {
    // const replies = [...commentData.replies, newReply];
    // updateReplies(replies, commentData.id);
    // setReplying(false);
  };

  const updateComment = () => {
    // editComment(content, commentData.id, "comment");
    // setEditing(false);
  };

  // const deleteComment = (id, type) => {
  //   const finalType = type !== undefined ? type : "comment";
  //   const finalId = id !== undefined ? id : commentData.id;
  //   commentDelete(finalId, finalType, commentData.id);
  //   setDeleting(false);
  // };

  return (
    <div className={`comment-container ${""}`}>
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={threadData}
            setReplying={setReplying}
            setDeleting={setDeleting}
            setDeleteModalState={setDeleteModalState}
            setEditing={setEditing}
            time={time}
          />
          {!editing ? (
            <div className="comment-content">
              {threadData?.companyThread?.message}
            </div>
          ) : (
            <textarea
              className="content-edit-box"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          )}
          {editing && (
            <button className="update-btn" onClick={updateComment}>
              update
            </button>
          )}
        </div>
      </div>

      {replying && (
        <AddComment
          buttonValue={"reply"}
          addComments={addReply}
          replyingTo={"ali"}
        />
      )}

      {/* <ReplyContainer
        key={commentData.replies.id}
        commentData={commentData.replies}
        updateScore={updateScore}
        commentPostedTime={commentPostedTime}
        addReply={addReply}
        editComment={editComment}
        deleteComment={deleteComment}
        setDeleteModalState={setDeleteModalState}
      /> */}

      {/* {deleting && (
        <DeleteModal
          setDeleting={setDeleting}
          deleteComment={deleteComment}
          setDeleteModalState={setDeleteModalState}
        />
      )} */}
    </div>
  );
};

export default Replies;
