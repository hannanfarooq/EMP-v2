import CommentBtn from "./CommentBtn";
import Avatar from "@mui/material/Avatar";

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
    <div className="comment--header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Avatar
        src={commentData?.companyThread?.User?.profilePic || ""}
        alt={commentData?.companyThread?.User?.firstName || "User Avatar"}
        sx={{ width: 40, height: 40 }}
      >
        {/* Fallback content: Display initials if no image is available */}
        {commentData?.companyThread?.User?.firstName
          ? commentData.companyThread.User.firstName[0]
          : "U"}
      </Avatar>
      <div>
        <div className="username" style={{ fontWeight: "bold" }}>
          {commentData?.companyThread?.User?.firstName}
        </div>
        {commentData?.companyThread?.User?.id === currentUser?.User?.id ? (
          <div className="you-tag" style={{ fontSize: "12px", color: "#888" }}>you</div>
        ) : null}
      </div>
      <div className="comment-posted-time" style={{  fontSize: "12px", color: "#888" }}>
        {`${time} ago`}
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
