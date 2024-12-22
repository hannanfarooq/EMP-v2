import { Helmet } from "react-helmet-async";
import { useState } from "react";
// @mui
import { Container, Stack, Typography } from "@mui/material";
// components
import {
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar,
} from "../sections/@dashboard/products";
// mock
import PRODUCTS from "../_mock/products";
import Checkout from "./checkout/Checkout";
import CartPage from "./BuyAndSell";
import TransitionsModal from "src/components/modal";
import SellProduct from "./BuyAndSell/sellProduct";
import ProductSort from "./BuyAndSell/ProductSort";
import { buyAndSellCategories } from "src/utils/baseURL";

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [category, setCategory] = useState("");

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Helmet>
        <title> Dashboard: Products | More.Me </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" sx={{ mb: 5 }}>
            Products
          </Typography>

          <div className="flex">
            <TransitionsModal
              open={open}
              handleClose={handleClose}
              handleOpen={handleOpen}
              title={"Add Product to sell"}
              component={<SellProduct />}
            />

            <Stack
              ml={2}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <ProductSort
                selected={category}
                onSort={setCategory}
                options={buyAndSellCategories}
              />
            </Stack>
          </div>
        </Stack>

        <CartPage category={category} />
      </Container>
    </>
  );
}
