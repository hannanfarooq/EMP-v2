import React, { useState } from "react";
import Slider from "react-slick";
import { Button, Modal, Typography } from "@mui/material";
import { Wrapper, ItemDetails, ModalBody } from "./Item.styles";
import SellProduct from "./sellProduct";
import { baseURL } from "src/utils/baseURL";

const CurrentUserProducts = ({ item, handleChatSeller, handleAddToCart }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0",
    margin: "0",
  };

  const imageStyle = {
    height: "250px",
    width: "100%",
    objectFit: "cover",
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const res = fetch(baseURL + `/api/DeleteBuyandSell/${item.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-token": currentUser.token,
      },
    });

    // Make delete API call here
    // Call handleDelete(item.id) or similar function
    setDeleteConfirmationModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationModalOpen(false);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
  };

  return (
    <Wrapper>
      <Slider {...settings}>
        {item.photo.map((photo, index) => (
          <img key={index} src={photo} alt={item.name} style={imageStyle} />
        ))}
      </Slider>
      <ItemDetails>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <h3>${item.price}</h3>
      </ItemDetails>

      {currentUser.user.id !== item?.sellerId && (
        <>
          {item?.sellerPhone && (
            <Button onClick={() => handleAddToCart(item)}>Call Seller</Button>
          )}
          <Button
            onClick={() =>
              handleChatSeller(item?.sellerId, currentUser.user.id)
            }
          >
            Chat
          </Button>
        </>
      )}

      {currentUser.user.id === item?.sellerId && (
        <>
          <Button onClick={handleEditClick}>Edit</Button>
          <Button onClick={handleDeleteClick}>Delete</Button>
        </>
      )}

      <Modal
        open={deleteConfirmationModalOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-modal-description"
      >
        <ModalBody>
          <Typography variant="h6" id="delete-confirmation-modal">
            Do you really want to delete?
          </Typography>
          <Button onClick={handleDeleteConfirm}>Yes</Button>
          <Button onClick={handleDeleteCancel}>No</Button>
        </ModalBody>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={handleEditCancel}
        aria-labelledby="edit-modal"
        aria-describedby="edit-modal-description"
      >
        <ModalBody>
          {/* Render the SellProduct component for editing here */}
          <SellProduct item={item} isEdit={true} />
          <Button onClick={handleEditCancel}>Cancel</Button>
        </ModalBody>
      </Modal>
    </Wrapper>
  );
};

export default CurrentUserProducts;
