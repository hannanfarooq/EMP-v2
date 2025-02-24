import { Helmet } from "react-helmet-async";
// @mui
import { Grid, Button, Container, Stack, Typography } from "@mui/material";
// components
import Iconify from "../components/iconify";
import {
  BlogPostCard,
  BlogPostsSort,
  BlogPostsSearch,
} from "../sections/@dashboard/blog";
// mock
import POSTS from "../_mock/blog";
import TransitionsModal from "src/components/modal";
import AddCompany from "src/components/company/form";
import { useEffect, useState } from "react";
import { useAuth } from "src/context/AuthContext";
import { GetAllCompanies } from "src/api";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

// ----------------------------------------------------------------------

export default function CompanyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [companiesData, setCompaniesData] = useState(); // Loading state
  const { userData } = useAuth();

  const getCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await GetAllCompanies(userData.token);
      if (data) {
        setCompaniesData(data.data);
        // You can process the data here
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false); // Don't forget to set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    if (userData && userData.token) {
      getCompanies();
    }
  }, [userData]);

  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Helmet>
        <title> Companies | More.Me </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Companies List <Iconify icon="mdi:company" />
          </Typography>

          <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            title={"Add New Company"}
            component={
              <AddCompany
                refetchCompanies={getCompanies}
                handleClose={handleClose}
              />
            }
          />
        </Stack>
        {!isLoading && (
          <Grid container spacing={3}>
            {companiesData?.map((post, index) => (
              <BlogPostCard
                key={post.id}
                post={post}
                index={index}
                refetchCompanies={getCompanies}
              />
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
