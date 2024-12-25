// import { Button } from "@material-ui/core";
import { Button, Card, IconButton } from "@mui/material";
// import { CartItemType } from "../App";
import RemoveIcon from '@mui/icons-material/Remove';
import { Wrapper } from "./CartItem.styles";
import AddIcon from '@mui/icons-material/Add';

const CartItem = ({ item, addToCart, removeFromCart }) => {
  return (
    <Card>
    <Wrapper>
      <div>
        <h3>{item.title}</h3>
        <div className="information">
          <p>Price: ${item.price}</p>
          <p>Total: ${(item.amount * item.price).toFixed(2)}</p>
        </div>
        <div className="buttons">
          <Button
            size="small"
            disableElevation
            variant="outlined"
            onClick={() => removeFromCart(item.id)}
          >
            <RemoveIcon />
          </Button>
          <p>{item.amount}</p>
          <Button
            size="small"
            disableElevation
            variant="outlined"
            onClick={() => addToCart(item)}
          >
            <AddIcon />
          </Button>
        </div>
      </div>
      <img src={item.image} alt={item.title} />
    </Wrapper>
    </Card>
  );
};

export default CartItem;
