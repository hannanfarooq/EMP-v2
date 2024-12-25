import { useState } from "react";
import "./Styles/AddComment.scss";
import { useAuth } from "src/context/AuthContext";
import { CreateThread } from "src/api";
import Filter from "bad-words";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";

const AddComment = ({ buttonValue, addComments, replyingTo }) => {
  const replyingToUser = replyingTo ? `@${replyingTo}, ` : "";
  const [comment, setComment] = useState("");
  const [images, setImage] = useState([]); // New state for storing the image
  const [isUploading, setIsUploading] = useState(false);
  const { userData } = useAuth();
  const filter = new Filter();

  const clickHandler = async () => {
    if ((comment.trim() === "" || comment === " ") && !images) return;

    const filteredText = filter.clean(comment);

    const newComment = {
      id: Math.floor(Math.random() * 100) + 5,
      content: replyingToUser + filteredText,
      createdAt: new Date(),
      score: 0,
      username: "juliusomo",
      currentUser: true,
      replies: [],
      images: images, // Attach the image to the comment
    };

    const data = {
      userId: userData.user.id,
      companyId: userData.company.id,
      message: filteredText,
      heading: "POST",
      images: images, 
    };

    const resp = await CreateThread(data);
    addComments(newComment);
    setComment("");
    setImage([]); // Clear the image after posting the comment
  };

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    setIsUploading(true);
    const upload = await uploadImageAndGetURL(selectedImage);
    setIsUploading(false);
    setImage([...images, upload]);
  };
  const removeImage = (indexToRemove) => {
    setImage((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      <div className="add-comment">
        <div className="profile-pic"></div>
        <textarea
          className="comment-input"
          placeholder="Share your thoughts..."
          value={replyingToUser + comment}
          onChange={(e) => {
            setComment(
              e.target.value.replace(replyingTo ? `@${replyingTo}, ` : "", "")
            );
          }}
        />
        <label className="camera-icon" htmlFor="image-upload">
          📷
        </label>
        {isUploading && <p>Loading...</p>}
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <div className="send-btn-container">
          <div className="profile-pic"></div>
          <button className="add-btn" onClick={clickHandler}>
            {buttonValue}
          </button>
        </div>
      </div>
      {images && images.length > 0 && <div>Attachments</div>}

      {images.length > 0 &&
        images.map((img, index) => (
          <div
            key={index}
            className="image-container"
            style={{ position: "relative" }}
          >
            {/* Render image */}
            <img
              src={img}
              alt={`Image ${index}`}
              width={100}
              height={100}
              style={{ borderRadius: "1px", resize: "cover" }}
            />
            {/* Cross sign to remove the image */}
            <button
              className="remove-image"
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                zIndex: 100,
              }}
              onClick={() => removeImage(index)}
            >
              &#10006;
            </button>
          </div>
        ))}
    </>
  );
};

export default AddComment;
