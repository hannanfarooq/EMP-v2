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

// ----------------------------------------------------------------------

export default function EditProfilePage() {
 
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit Profile | More.Me </title>
      </Helmet>

      <Container>
       <h2>Edit profile</h2>
      </Container>
    </>
  );
}
