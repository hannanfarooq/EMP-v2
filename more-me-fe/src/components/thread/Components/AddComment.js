// import React, { useState } from "react";
// import "./Styles/AddComment.scss";
// import { useAuth } from "src/context/AuthContext";
// import { CreateThread } from "src/api";
// import Filter from "bad-words";
// import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
// import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
// import Microlink from '@microlink/react';

// const AddComment = ({ threadData, buttonValue }) => {
//   const [comment, setComment] = useState("");
//   const [images, setImages] = useState([]);
//   const [pdfs, setPdfs] = useState([]);
//   const [links, setLinks] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const { userData } = useAuth();
//   const filter = new Filter();

//   const clickHandler = async () => {
//     if ((comment.trim() === "" || comment === " ") && !images.length && !pdfs.length && !links.length)
//       return;

//     const filteredText = filter.clean(comment);
//     let data = {
//       userId: userData.user.id,
//       companyId: userData.company.id,
//       message: filteredText,
//       heading: "POST",
//       images,
//       pdfs,
//       links,
//       parentId: threadData ? threadData.companyThread.id : null,
//     };

//     console.log("UPLOAD DATA", data);
//     const resp = await CreateThread(data);
//     setComment("");
//     setImages([]);
//     setPdfs([]);
//     setLinks([]);
//   };

//   const handleImageUpload = async (e) => {
//     setIsUploading(true);
//     const uploadUrl = await uploadImageAndGetURL(e.target.files[0]);
//     setImages([...images, uploadUrl]);
//     setIsUploading(false);
//   };

//   const handlePDFUpload = async (e) => {
//     setIsUploading(true);
//     const uploadUrl = await uploadPDFAndGetURL(e.target.files[0]);
//     setPdfs([...pdfs, uploadUrl]);
//     setIsUploading(false);
//   };

//   const handleLinkAdd = (e) => {
//     if (e.key === "Enter" && e.target.value.trim()) {
//       setLinks([...links, e.target.value.trim()]);
//       e.target.value = '';
//     }
//   };

//   const removeAttachment = (index, type) => {
//     if (type === "image") {
//       setImages(images.filter((_, idx) => idx !== index));
//     } else if (type === "pdf") {
//       setPdfs(pdfs.filter((_, idx) => idx !== index));
//     } else if (type === "link") {
//       setLinks(links.filter((_, idx) => idx !== index));
//     }
//   };

//   return (
//     <>
//       <div className="add-comment">
//         <textarea
//           className="comment-input"
//           placeholder="Share your thoughts..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//         />
//         <div className="file-inputs">
//           <label style={{cursor:"pointer"}} htmlFor="image-upload">📷
//             <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
//           </label>
//           <label style={{cursor:"pointer"}} htmlFor="pdf-upload"> 📄
//             <input type="file" id="pdf-upload" accept="application/pdf" onChange={handlePDFUpload} style={{ display: "none" }} />
//           </label>
//           <input class="add-link" type="text" placeholder="Add a link..." onKeyPress={handleLinkAdd} />
//         </div>
//         {isUploading && <p>Uploading...</p>}
//         <button className="add-btn" onClick={clickHandler}>{buttonValue}</button>
//       </div>

//       <div className="attachments">
//         {images.map((img, index) => (
//           <div key={index}>
//             <img src={img} alt={`Attachment ${index}`} />
//             <button onClick={() => removeAttachment(index, 'image')}>Remove</button>
//           </div>
//         ))}
//         {pdfs.map((pdf, index) => (
//           <div key={index}>
//             <a href={pdf} target="_blank" rel="noopener noreferrer">PDF {index + 1}</a>
//             <button onClick={() => window.open(pdf, '_blank')}>View PDF</button>
//           </div>
//         ))}
//         {links.map((link, index) => (
//           <div key={index}>
//             <Microlink url={link} size="large" />
//             <button onClick={() => removeAttachment(index, 'link')}>Remove</button>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default AddComment;


// import React, { useState } from "react";
// import "./Styles/AddComment.scss";
// import { useAuth } from "src/context/AuthContext";
// import { CreateThread } from "src/api";
// import Filter from "bad-words";
// import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
// import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
// import Microlink from '@microlink/react';

// const AddComment = ({ threadData, buttonValue }) => {
//   const [comment, setComment] = useState("");
//   const [images, setImages] = useState([]);
//   const [pdfs, setPdfs] = useState([]);
//   const [links, setLinks] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const { userData } = useAuth();
//   const filter = new Filter();

//   const clickHandler = async () => {
//     if ((comment.trim() === "" || comment === " ") && !images.length && !pdfs.length && !links.length)
//       return;

//     const filteredText = filter.clean(comment);
//     let data = {
//       userId: userData.user.id,
//       companyId: userData.company.id,
//       message: filteredText,
//       heading: "POST",
//       images,
//       pdfs,
//       links,
//       parentId: threadData ? threadData.companyThread.id : null,
//     };

//     console.log("UPLOAD DATA", data);
//     const resp = await CreateThread(data);
//     setComment("");
//     setImages([]);
//     setPdfs([]);
//     setLinks([]);
//   };

//   const handleImageUpload = async (e) => {
//     setIsUploading(true);
//     const uploadUrl = await uploadImageAndGetURL(e.target.files[0]);
//     setImages([...images, uploadUrl]);
//     setIsUploading(false);
//   };

//   const handlePDFUpload = async (e) => {
//     setIsUploading(true);
//     const uploadUrl = await uploadPDFAndGetURL(e.target.files[0]);
//     setPdfs([...pdfs, uploadUrl]);
//     setIsUploading(false);
//   };

//   const handleLinkAdd = (e) => {
//     if (e.key === "Enter" && e.target.value.trim()) {
//       setLinks([...links, e.target.value.trim()]);
//       e.target.value = '';
//     }
//   };

//   const removeAttachment = (index, type) => {
//     if (type === "image") {
//       setImages(images.filter((_, idx) => idx !== index));
//     } else if (type === "pdf") {
//       setPdfs(pdfs.filter((_, idx) => idx !== index));
//     } else if (type === "link") {
//       setLinks(links.filter((_, idx) => idx !== index));
//     }
//   };

//   return (
//     <>
//       <div className="add-comment">
//         <textarea
//           className="comment-input"
//           placeholder="Share your thoughts..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//         />
//         <div className="file-inputs">
//           <label style={{cursor:"pointer"}} htmlFor="image-upload">📷
//             <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
//           </label>
//           <label style={{cursor:"pointer"}} htmlFor="pdf-upload"> 📄
//             <input type="file" id="pdf-upload" accept="application/pdf" onChange={handlePDFUpload} style={{ display: "none" }} />
//           </label>
//           <input class="add-link" type="text" placeholder="Add a link..." onKeyPress={handleLinkAdd} />
//         </div>
//         {isUploading && <p>Uploading...</p>}
//         <button className="add-btn" onClick={clickHandler}>{buttonValue}</button>
//       </div>

//       <div className="attachments">
//         {images.map((img, index) => (
//           <div key={index}>
//             <img src={img} alt={`Attachment ${index}`} />
//             <button onClick={() => removeAttachment(index, 'image')}>Remove</button>
//           </div>
//         ))}
//         {pdfs.map((pdf, index) => (
//           <div key={index}>
//             <a href={pdf} target="_blank" rel="noopener noreferrer">PDF {index + 1}</a>
//             <button onClick={() => window.open(pdf, '_blank')}>View PDF</button>
//           </div>
//         ))}
//         {links.map((link, index) => (
//           <div key={index}>
//             <Microlink url={link} size="large" />
//             <button onClick={() => removeAttachment(index, 'link')}>Remove</button>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default AddComment;


import React, { useState } from "react";
import "./Styles/AddComment.scss";
import { useAuth } from "src/context/AuthContext";
import { CreateThread } from "src/api";
import Filter from "bad-words";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
import Microlink from '@microlink/react';
import { FaCamera, FaFilePdf, FaLink, FaTimes, FaEye, FaPlus, FaVideo } from 'react-icons/fa'; // Importing FaPlus for Add button icon
import { set } from "lodash";


const AddComment = ({ threadData, buttonValue = "Post",setReplying }) => {
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState(""); // New state for link input
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(""); // State for error handling
  const { userData } = useAuth();
  const filter = new Filter();
  const [videos, setVideos] = useState([]); // ✅ Add video state
  // Utility function to validate URLs
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  }

  const clickHandler = async () => {
    // Check for pending link
    if (currentLink.trim() !== "") {
      setError("Press the + button to include the link.");
      return;
    }

    // Trim the comment to remove whitespace
    if (comment.trim() === "" && !images.length && !pdfs.length && !links.length) {
      setError("The comment field cannot be empty.");
      return;
    }

    // If there's text but still empty after trimming
    if (comment.trim() === "" && (images.length || pdfs.length || links.length)) {
      setError("Please provide a valid comment.");
      return;
    }

    // Clear any existing errors
    setError("");

    const filteredText = filter.clean(comment);
    let data = {
      userId: userData.user.id,
      companyId: userData.company.id,
      message: filteredText,
      heading: "POST",
      images,
      pdfs,
      videos, // ✅ Include videos in the data
      links,
      parentId: threadData ? threadData.companyThread.id : null,
    };

    console.log("UPLOAD DATA", data);
    try {
      const resp = await CreateThread(data);
      // Handle response if needed
      setComment("");
      setImages([]);
      setPdfs([]);
      setLinks([]);
      setVideos([]); // ✅ Clear videos
      setReplying(false);
    } catch (error) {
      console.error("Error creating thread:", error);
     
    }
  };

  const handleImageUpload = async (e) => {
    if (e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadUrl = await uploadImageAndGetURL(e.target.files[0]);
      setImages([...images, uploadUrl]);
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePDFUpload = async (e) => {
    if (e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadUrl = await uploadPDFAndGetURL(e.target.files[0]);
      setPdfs([...pdfs, uploadUrl]);
    } catch (error) {
      console.error("PDF upload failed:", error);
      setError("PDF upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkAdd = () => {
    const trimmedLink = currentLink.trim();
    if (trimmedLink && isValidURL(trimmedLink)) {
      setLinks([...links, trimmedLink]);
      setCurrentLink("");
      setError("");
    } else if (trimmedLink) {
      setError("Please enter a valid URL.");
    }
  };

  const handleLinkKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLinkAdd();
    }
  };

  const removeAttachment = (index, type) => {
    if (type === "image") {
      setImages(images.filter((_, idx) => idx !== index));
    } else if (type === "pdf") {
      setPdfs(pdfs.filter((_, idx) => idx !== index));
    } else if (type === "link") {
      setLinks(links.filter((_, idx) => idx !== index));
    }
  };

  // Handle changes in comment and link input to clear errors
  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (error) setError("");
  };

  const handleLinkChange = (e) => {
    setCurrentLink(e.target.value);
    if (error && e.target.value.trim() !== "") setError("");
  };
  const handleVideoUpload = async (e) => {
    if (e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadUrl = await uploadImageAndGetURL(e.target.files[0]); // ✅ Upload video
      setVideos([...videos, uploadUrl]); // ✅ Update state
      e.target.value = "";
    } catch (error) {
      console.error("Video upload failed:", error);
      setError("Video upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="add-comment-container">
      <div className="add-comment">
        <textarea
          className={`comment-input ${error && comment.trim() === "" ? "error" : ""}`}
          placeholder={"Share your thoughts..."}
          value={comment}
          onChange={handleCommentChange}
        />
        {error && (
          <p className="error-message">
            {comment.trim() === "" && !images.length && !pdfs.length && !links.length
              ? error
              : comment.trim() === "" && (images.length || pdfs.length || links.length)
              ? error
              : currentLink.trim() !== ""
              ? error
              : ""}
          </p>
        )} {/* Error message */}
      
        <div className="file-inputs">
        {
          buttonValue== "Post" &&
          (<>  <label htmlFor="image-upload" className="file-label">
            <FaCamera />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
       
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
          <label htmlFor="pdf-upload" className="file-label">
            <FaFilePdf />
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
          
              onChange={handlePDFUpload}
              style={{ display: "none" }}
            />
          </label>
          
          <label htmlFor="video-upload" className="file-label"> {/* ✅ Add video input */}
                <FaVideo />
                <input type="file" id="video-upload" accept="video/*" onChange={handleVideoUpload} style={{ display: "none" }} />
              </label></>)
        }
        
          <div className="link-input-wrapper">
            <FaLink className="link-icon" />
            <input
              type="text"
              placeholder={"Add a link..."}
              className="link-input"
              value={currentLink}
              onChange={handleLinkChange}
              onKeyPress={handleLinkKeyPress}
            />
            <button
              className="add-link-btn"
              onClick={handleLinkAdd}
              disabled={!currentLink.trim() || !isValidURL(currentLink.trim())}
              aria-label="Add link"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        {isUploading && <p className="uploading-text">Uploading...</p>}
        <button className="add-btn" disabled={isUploading ||comment.trim() === ""} onClick={clickHandler}>
          {buttonValue}
        </button>
      </div>

      <div className="attachments">
        {images.length > 0 && (
          <div className="attachment-section image-section">
            <h4>Images</h4>
            <div className="image-grid">
              {images.map((img, index) => (
                <div key={index} className="image-wrapper">
                  <img src={img} alt={`Attachment ${index}`} />
                  <button
                    className="remove-btn"
                    onClick={() => removeAttachment(index, 'image')}
                    aria-label="Remove image"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {pdfs.length > 0 && (
          <div className="attachment-section pdf-section">
            <h4>PDFs</h4>
            <ul className="pdf-list">
              {pdfs.map((pdf, index) => (
                <li key={index} className="pdf-item">
                  <a
                    href={pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-link"
                  >
                    PDF {index + 1}
                  </a>
                  <button
                    className="view-btn"
                    onClick={() => window.open(pdf, '_blank')}
                    aria-label="View PDF"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeAttachment(index, 'pdf')}
                    aria-label="Remove PDF"
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

<div className="attachments">
        {videos.length > 0 && (
          <div className="attachment-section video-section">
            <h4>Videos</h4>
            <div className="video-grid">
              {videos.map((video, index) => (
                <div key={index} className="video-wrapper">
                  <video src={video} controls width="250"></video> {/* ✅ Display video */}
                  <button className="remove-btn" onClick={() => removeAttachment(index, "video")}>
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
        {links.length > 0 && (
          <div className="attachment-section link-section">
            <h4>Links</h4>
            <div className="links-grid">
              {links.map((link, index) => (
                <div key={index} className="link-wrapper">
                  <Microlink url={link} size="large" />
                  <button
                    className="remove-btn"
                    onClick={() => removeAttachment(index, 'link')}
                    aria-label="Remove link"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddComment;