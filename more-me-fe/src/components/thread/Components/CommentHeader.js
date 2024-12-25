import CommentBtn from "./CommentBtn";

const CommentHeader = ({
  commentData,
  setReplying,
  setDeleting,
  setDeleteModalState,
  setEditing,
  time,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="comment--header">
      <div
        className={`profile-pic ${commentData?.companyThread?.User?.profilePic}`}
      ></div>
      <div className="username">
        {commentData?.companyThread?.User?.firstName}
      </div>
      {commentData?.companyThread?.User?.id === currentUser?.User?.id ? (
        <div className="you-tag">you</div>
      ) : (
        ""
      )}
      <div className="comment-posted-time">{`${time} ago`}</div>
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
