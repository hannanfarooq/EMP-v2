import React from "react";
import Slider from "react-slick";
import { Button } from "@mui/material";
import { Wrapper, ItemDetails } from "./Item.styles";

const Item = ({ item, handleAddToCart, handleChatSeller }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Show navigation arrows
    centerMode: true, // Enable center mode
    centerPadding: "0", // Adjust the padding in center mode
    margin:"0"
  };

  const imageStyle = {
    height: "250px",
    width: "100%",
    objectFit: "cover",
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
          <Button onClick={() => handleChatSeller(item?.sellerId, currentUser.user.id)}>
            Chat
          </Button>
        </>
      )}
    </Wrapper>
  );
};

export default Item;