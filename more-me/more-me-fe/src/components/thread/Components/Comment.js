
import { useEffect, useState } from "react";
import "./Styles/Comment.scss";
import { commentPostedTime } from "../utils";
import CommentHeader from "./CommentHeader";
import AddComment from "./AddComment";
import Replies from "./Replies";

const Comment = ({ threadData }) => {
  const [replying, setReplying] = useState(false);
  const [time, setTime] = useState("");
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(threadData?.companyThread?.message);

  const createdAt = new Date(threadData.companyThread?.createdAt);
  const today = new Date();
  const differenceInTime = today.getTime() - createdAt.getTime();

  useEffect(() => {
    setTime(commentPostedTime(differenceInTime));
  }, [differenceInTime]);

  const updateComment = () => {
    // Handle comment update logic
    setEditing(false);
  };

  return (
    <div className={`comment-container ${"reply-container-gap"}`}>
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={threadData}
            setReplying={setReplying}
            setEditing={setEditing}
            time={time}
          />

          {!editing ? (
            <div className="comment-content">{content}</div>
          ) : (
            <textarea
              className="content-edit-box"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}

          {editing && (
            <button className="update-btn" onClick={updateComment}>
              Update
            </button>
          )}
        </div>
      </div>

      {replying && (
        <AddComment
          threadData={threadData}
          buttonValue={"Reply"}
          addComments={() => {}}
        />
      )}

      {threadData.replies.length > 0 && (
        <div className="replies-container">
          {threadData.replies.map((reply) => (
            <Comment key={reply.companyThread.id} threadData={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
