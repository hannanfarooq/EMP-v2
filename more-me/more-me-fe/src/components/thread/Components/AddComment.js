import React, { useState } from "react";
import "./Styles/AddComment.scss";
import { useAuth } from "src/context/AuthContext";
import { CreateThread } from "src/api";
import Filter from "bad-words";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
import Microlink from '@microlink/react';

const AddComment = ({ threadData, buttonValue }) => {
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [links, setLinks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { userData } = useAuth();
  const filter = new Filter();

  const clickHandler = async () => {
    if ((comment.trim() === "" || comment === " ") && !images.length && !pdfs.length && !links.length)
      return;

    const filteredText = filter.clean(comment);
    let data = {
      userId: userData.user.id,
      companyId: userData.company.id,
      message: filteredText,
      heading: "POST",
      images,
      pdfs,
      links,
      parentId: threadData ? threadData.companyThread.id : null,
    };

    console.log("UPLOAD DATA", data);
    const resp = await CreateThread(data);
    setComment("");
    setImages([]);
    setPdfs([]);
    setLinks([]);
  };

  const handleImageUpload = async (e) => {
    setIsUploading(true);
    const uploadUrl = await uploadImageAndGetURL(e.target.files[0]);
    setImages([...images, uploadUrl]);
    setIsUploading(false);
  };

  const handlePDFUpload = async (e) => {
    setIsUploading(true);
    const uploadUrl = await uploadPDFAndGetURL(e.target.files[0]);
    setPdfs([...pdfs, uploadUrl]);
    setIsUploading(false);
  };

  const handleLinkAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setLinks([...links, e.target.value.trim()]);
      e.target.value = '';
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

  return (
    <>
      <div className="add-comment">
        <textarea
          className="comment-input"
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="file-inputs">
          <label htmlFor="image-upload">📷
            <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
          <label htmlFor="pdf-upload">📄
            <input type="file" id="pdf-upload" accept="application/pdf" onChange={handlePDFUpload} style={{ display: "none" }} />
          </label>
          <input type="text" placeholder="Add a link..." onKeyPress={handleLinkAdd} />
        </div>
        {isUploading && <p>Uploading...</p>}
        <button className="add-btn" onClick={clickHandler}>{buttonValue}</button>
      </div>

      <div className="attachments">
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Attachment ${index}`} />
            <button onClick={() => removeAttachment(index, 'image')}>Remove</button>
          </div>
        ))}
        {pdfs.map((pdf, index) => (
          <div key={index}>
            <a href={pdf} target="_blank" rel="noopener noreferrer">PDF {index + 1}</a>
            <button onClick={() => window.open(pdf, '_blank')}>View PDF</button>
          </div>
        ))}
        {links.map((link, index) => (
          <div key={index}>
            <Microlink url={link} size="large" />
            <button onClick={() => removeAttachment(index, 'link')}>Remove</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AddComment;
