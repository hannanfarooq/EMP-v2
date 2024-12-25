import { AddShoppingCart, FormatListBulleted } from "@mui/icons-material";
import {
  Badge,
  Drawer,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ProductCartWidget } from "src/sections/@dashboard/products";
import { StyledButton, Wrapper } from "./App.styles";
import Item from "./item";
import { createConversation, getSellingItems } from "src/api";
import { useNavigate } from "react-router";
import CurrentUserProducts from "./CurrentUserProducts";

const getProducts = async (category = "") => await getSellingItems(category);

export default function CartPage({ category = "" }) {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // 0 for "My Products", 1 for "All Products"
  const [myProduct, setMyProducts] = useState([]);

  const {
    data: allProductsData,
    isLoading: allProductsLoading,
    error: allProductsError,
  } = useQuery(["allProducts", category], () => getProducts(category));

  const handleAddToCart = (clickedItem) => {
    window.location.href = `tel:${clickedItem.sellerPhone}`;
  };

  const handleChatSeller = async (sellerId, buyerId) => {
    createConversation({
      user1Id: sellerId,
      user2Id: buyerId,
    }).then(() => window.open("/chat", "_blank"));
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    if (allProductsData && allProductsData.items.length > 0) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const UserId = currentUser.user.id;
      const filteredItems = allProductsData.items.filter(
        (item) => item.sellerId === UserId
      );
      setMyProducts(filteredItems);
    }
  }, [allProductsData]);


  if (allProductsLoading) return <LinearProgress />;
  if (allProductsError) return <div>Something went wrong</div>;

  return (
    <Wrapper>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab icon={<AddShoppingCart />} label="All Prodcuts" />
        <Tab icon={<FormatListBulleted />} label="My Products" />
      </Tabs>
      <Typography variant="h6" gutterBottom>
        {selectedTab === 1 ? "My Products" : "All Products"}
      </Typography>
      <Grid container spacing={3}>
        {selectedTab === 1
          ? myProduct && myProduct.length>0 && myProduct?.map((item) => (
              <Grid item key={item.id} xs={12} sm={4}>
                <CurrentUserProducts
                  item={item}
                  handleAddToCart={handleAddToCart}
                  handleChatSeller={handleChatSeller}
                />
              </Grid>
            ))
          : allProductsData?.items?.map((item) => (
              <Grid item key={item.id} xs={12} sm={4}>
                <Item
                  item={item}
                  handleAddToCart={handleAddToCart}
                  handleChatSeller={handleChatSeller}
                />
              </Grid>
            ))}
      </Grid>
    </Wrapper>
  );
}
