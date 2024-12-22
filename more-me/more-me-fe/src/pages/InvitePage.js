import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system'; // Correct import for Material-UI v5
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'src/context/AuthContext';
import { inviteBulkUsers } from 'src/api';
import { FileUpload } from './FileUpload';
import { getAllCompanyUser } from "src/api";

// Define the styles
const Root = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  '&:hover p,&:hover svg,& img': {
    opacity: 1,
  },
  '& p, svg': {
    opacity: 0.4,
  },
  '&:hover img': {
    opacity: 0.3,
  },
}));

const NoMouseEvent = styled('div')({
  pointerEvents: 'none',
  display: 'none',
});

const IconText = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
});

const HiddenInput = styled('input')({
  display: 'none',
});

const DuplicateItem = styled(ListItem)({
  backgroundColor: '#ffdddd', // Light red background for duplicates
});

const UniqueItem = styled(ListItem)({
  backgroundColor: '#ddffdd', // Light green background for unique
});

export default function InvitePage() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState([]);

  const fileUploadProp = {
    accept: '.csv',
    onChange: (event) => {
      if (event.target.files !== null && event.target.files.length > 0) {
        Papa.parse(event.target.files[0], {
          header: true,
          complete: (result) => {
            const users = result.data
              .map((user) => ({
                email: user.email?.trim() || '',
                role: user.role?.trim() || '',
                firstName: user.firstName?.trim() || '',
                lastName: user.lastName?.trim() || '',
              }))
              .filter(
                (user) =>
                  user.email &&
                  user.role &&
                  user.firstName &&
                  user.lastName
              );

            setFetchedUsers(users);
          },
        });
      }
    },
    onDrop: (event) => {
      console.log(`Drop ${event.dataTransfer.files[0].name}`);
    },
  };

  const handleInviteUsers = async () => {
    console.log("Fetched Users:", fetchedUsers);

    // Retrieve the current user's data from local storage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const companyData = await getAllCompanyUser(
      currentUser.token,
      currentUser.company.id
    );
    console.log("Company Data:", companyData);

    const companyEmails = companyData.data.map((user) => user.email);
    const duplicatesList = [];
    const uniqueList = [];

    fetchedUsers.forEach((user) => {
      if (companyEmails.includes(user.email)) {
        duplicatesList.push(user);
      } else {
        uniqueList.push(user);
      }
    });

    setDuplicates(duplicatesList);
    setUniqueUsers(uniqueList);

    console.log("Duplicates:", duplicatesList);
    console.log("Unique Users:", uniqueList);
  };

  return (
    <>
      <Helmet>
        <title>Invite | More.Me</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Send Invites by CSV
        </Typography>

        {fetchedUsers.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 5 }}>
              Fetched {fetchedUsers.length} users from the uploaded CSV
            </Typography>

            <Button
              onClick={handleInviteUsers}
              size="large"
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ margin: '20px', float: 'right' }}
            >
              Compare Emails
            </Button>
          </>
        )}

        {fetchedUsers.length === 0 && <FileUpload width="100%" {...fileUploadProp} />}

        {duplicates.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: 'red' }}>
              Duplicate Emails Found:
            </Typography>
            <List>
              {duplicates.map((user, index) => (
                <DuplicateItem key={index}>
                  <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
                </DuplicateItem>
              ))}
            </List>
          </>
        )}

        {uniqueUsers.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: 'green' }}>
              Unique Emails to be Invited:
            </Typography>
            <List>
              {uniqueUsers.map((user, index) => (
                <UniqueItem key={index}>
                  <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
                </UniqueItem>
              ))}
            </List>
            <Button
              onClick={async () => {
                try {
                  const data = await inviteBulkUsers(userData.token, uniqueUsers);
                  if (data) {
                    toast.success('🦄 Invites sent successfully!');
                    navigate('/dashboard/app');
                  }
                } catch (error) {
                  console.error('Error sending invites:', error);
                }
              }}
              size="large"
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ margin: '20px', float: 'right' }}
            >
              Send Invites
            </Button>
          </>
        )}
      </Container>
    </>
  );
}
