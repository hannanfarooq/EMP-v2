// import { Button } from "@material-ui/core";
// import { CartItemType } from "../App";
// import CartItem from "../CartItem/CartItem";

import { Box, Button, Divider, Typography } from "@mui/material";
import TransitionsModal from "src/components/modal/index.js";
import Checkout from "../checkout/Checkout.js";
import { Wrapper } from "./Cart.styles.js";
import CartItem from "./cartItem.js";

const Cart = ({ cartItems, addToCart, removeFromCart }) => {
  const calculateTotal = (items) =>
    items.reduce((acc, item) => acc + item.amount * item.price, 0);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Wrapper>
      <Typography variant="h3">Your Cart</Typography>
      {cartItems.length === 0 ? <p>No items in cart.</p> : null}
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
      <Divider sx={{ mt: 5, mb: 2 }} />
      <Box
        display={"flex"}
        justifyContent="space-between"
        sx={{ mt: 0, mb: 2 }}
      >
        <Typography variant="h5">Total: </Typography>
        <Typography variant="h4">
          ${calculateTotal(cartItems).toFixed(2)}
        </Typography>
      </Box>
      {/* <Button variant="contained" color="success" fullWidth>
        Checkout
      </Button> */}
      <TransitionsModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
        className="checkout"
        component={<Checkout items={cartItems} />}
        icon={<></>}
        title="Checkout"
      />
    </Wrapper>
  );
};

export default Cart;
