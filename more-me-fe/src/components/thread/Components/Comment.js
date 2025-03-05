import React, { useEffect, useState } from 'react';
import "./Styles/Comment.scss";
import { commentPostedTime } from "../utils";
import CommentHeader from "./CommentHeader";
import AddComment from "./AddComment";
import Microlink from '@microlink/react'; // For link previews
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Box, IconButton, Typography } from '@mui/material'; // Material UI components
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Comment = ({ threadData, isdashboard = false }) => {
  const [replying, setReplying] = useState(false);
  const [time, setTime] = useState("");
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(threadData?.companyThread?.message);
  const [showReplies, setShowReplies] = useState(false); // State for toggle visibility of replies

  // Calculate the time difference
  useEffect(() => {
    const createdAt = new Date(threadData.companyThread?.createdAt);
    const today = new Date();
    const differenceInTime = today.getTime() - createdAt.getTime();
    setTime(commentPostedTime(differenceInTime));
  }, [threadData.companyThread?.createdAt]);

  const updateComment = () => {
    setEditing(false);
  };

  const renderImages = () => {
    if (threadData?.companyThread?.images && threadData.companyThread.images.length > 0) {
      return (
        <div className="images-container">
          {threadData.companyThread.images.map((image, index) => (
           <img
           key={index}
           src={image}
           alt={`Image ${index + 1}`}
           style={{
             width: "100%",
             maxWidth: "150px",
             height: "auto",
             borderRadius: "8px",
             border: "1px solid #ddd",
           }}
         />
          ))}
        </div>
      );
    }
    return null;
  };

  const renderVideos = () => {
    if (threadData?.companyThread?.videos && threadData.companyThread.videos.length > 0) {
      return (
        <div className="videos-container">
          {threadData.companyThread.videos.map((video, index) => (
            <video
              key={index}
              src={video}
              controls
              style={{
                width: "100%",
                maxWidth: "850px",
                height: "auto",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          ))}
        </div>
      );
    }
    return null;
  };
  
  const renderPDFs = () => {
    return (
      <div className="pdfs-container">
        {threadData?.companyThread?.pdfs?.map((pdf, index) => {
         const pdfName = pdf.split("/").pop().split("?")[0]; // Extract name from URL
                    return (
                      <Box key={index} sx={{ mt: 1 }}>
                        <button
                          onClick={() => window.open(pdf, "_blank")}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                          }}
                        >
                          "View PDF:" {decodeURIComponent(pdfName)}
                        </button>
                      </Box>
                    );
        })}
      </div>
    );
  };

  const renderLinks = () => {
    return (
      <div className="links-container">
        {threadData?.companyThread?.links?.map((link, index) => (
          <Microlink key={index} url={link} size="medium" />
        ))}
      </div>
    );
  };

  // Toggle the visibility of replies
  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <div className={`comment-container ${replying ? "reply-container-gap" : ""}`}>
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={threadData} // Pass full thread data for flexibility
            replying={replying}
            setReplying={setReplying}
            editing={editing}
            setEditing={setEditing}
            time={time}
            isdashboard={isdashboard}
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

          {/* Render attachments if available */}
          {renderImages()}
          {renderPDFs()}
          {renderLinks()}
          {
          renderVideos()
          }

          {editing && (
            <button className="update-btn" onClick={updateComment}>
              Update
            </button>
          )}

            {/* Show or hide replies */}
      {threadData.replies.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <IconButton
            size="small"
            onClick={toggleReplies}
            aria-label={showReplies ? "Hide replies" : "Show replies"}
          >
            {showReplies ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Typography variant="caption" sx={{ ml: 1 }}>
            {showReplies ? "Hide replies": "Show replies"}
          </Typography>
        </Box>
      )}

      {showReplies && threadData.replies.length > 0 && (
        <div className="replies-container">
          {threadData.replies.map((reply) => (
            <Comment key={reply.companyThread.id} threadData={reply} isdashboard={isdashboard} />
          ))}
        </div>
      )}
        </div>
      </div>

      {replying && (
        <AddComment
          threadData={threadData}
          buttonValue={"Reply"}
          setReplying={setReplying}
        />
      )}

    
    </div>
  );
};

export default Comment;
