import { AddShoppingCart } from "@mui/icons-material";
import { Badge, Drawer, Grid, LinearProgres, LinearProgress } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { ProductCartWidget } from "src/sections/@dashboard/products";
import { StyledButton, Wrapper } from "./App.styles";
import Cart from "./cart";
import Item from "./item";

const getProducts = async () =>
  await (await fetch("https://fakestoreapi.com/products/category/electronics?sort=desc")).json();

export default function CartPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const { data, isLoading, error } = useQuery(
    "products",
    getProducts
  );

  const getTotalItems = (items) =>
    items.reduce((acc, item) => acc + item.amount, 0);

  const handleAddToCart = (clickedItem) => {
    setCartItems((prev) => {
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }

      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.amount === 1) return acc;
          return [...acc, { ...item, amount: item.amount - 1 }];
        } else {
          return [...acc, item];
        }
      }, [])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong</div>;

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>

      {/* <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} showZero color="error" max={99}>
          <AddShoppingCart />
        </Badge>
      </StyledButton> */}

      <ProductCartWidget setCartOpen={setCartOpen} badgeCount={getTotalItems(cartItems)} />

      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}
