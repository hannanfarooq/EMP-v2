import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Avatar } from '@mui/material';
import { getUserGamificationsbyCompnay } from 'src/api';

// ViewGamification Component
const ViewGamification = ({ companyId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchgamesdata = async () => {
    try {
      const categoryList = await getUserGamificationsbyCompnay(companyId); // Ensure companyId is passed to the API function
      console.log(categoryList.data);
      if (categoryList?.data) {
        setLoading(false);
        setData(categoryList?.data);
      }
    } catch (error) {
      console.error('Failed to fetch question categories:', error);
    }
  };

  useEffect(() => {
    fetchgamesdata();
  }, [companyId]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#2596be' }}>
            <TableCell>Profile Picture</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#d32f2f' }}>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={user.profilePic}
                alt="Profile"
              />
             
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#d32f2f' }}>{user.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewGamification;
