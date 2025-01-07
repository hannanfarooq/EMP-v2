import React, { useEffect, useState } from 'react';
import "./Styles/Comment.scss";
import { commentPostedTime } from "../utils";
import CommentHeader from "./CommentHeader";
import AddComment from "./AddComment";
import Replies from "./Replies";
import Microlink from '@microlink/react'; // For link previews
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const Comment = ({ threadData }) => {
  const [replying, setReplying] = useState(false);
  const [time, setTime] = useState("");
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(threadData?.companyThread?.message);

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
            <img key={index} src={image} alt={`Image ${index + 1}`} className="comment-image" />
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
          const pdfName = pdf.split('/').pop().split('?')[0]; // Extract name from URL
          return (
            <div key={index} className="pdf-viewer-container">
              <button
                onClick={() => window.open(pdf, '_blank')}
                className="view-pdf-button"
              >
                View PDF: {decodeURIComponent(pdfName)}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLinks = () => {
    return (
      <div className="links-container">
        {threadData?.companyThread?.links?.map((link, index) => (
          <Microlink key={index} url={link} size="large" />
        ))}
      </div>
    );
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
