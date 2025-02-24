import React, { useState } from "react";
import { Card, CardContent, Avatar, Button, Input } from "@mui/material";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { UpdateUser } from "src/api";

const UpdateProfile = ({ user, onUpdate, setUserUpdated , userUpdated}) => {
  console.log("profile pic", user);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [profilePicture, setProfilePicture] = useState(user.profilePic);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    // If a new image is selected, upload it
    // if (profilePicture instanceof File) {
    //   const imageUrl = await uploadImageAndGetURL(profilePicture);
    //   if (imageUrl) {
    //     setProfilePicture(imageUrl);
    //   } else {
    //     // Handle the case when image upload fails
    //     setLoading(false);
    //     return;
    //   }
    // }

    const updatedUser = {
      id: user.id,
      firstName,
      lastName,
      profilePic: profilePicture,
      email: user.email,
    };
    const updateUserdata = await UpdateUser(updatedUser);
    if (updateUserdata.data) {
      const currentUserData = JSON.parse(localStorage.getItem("currentUser"));
      const updatedUserData = { ...currentUserData, user: updateUserdata.data };
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));

    }

    // Call the onUpdate callback with the updated user information
    onUpdate(updatedUser);

    setLoading(false);
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setLoading(true);

      const imageUrl = await uploadImageAndGetURL(file);

      if (imageUrl) {
        setProfilePicture(imageUrl);
        setLoading(false);
      } else {
        // Handle the case when image upload fails
        setLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Avatar
          sx={{ width: 100, height: 100, cursor: "pointer" }}
          src={profilePicture}
          alt="Profile"
          onClick={() => document.getElementById("profilePictureInput").click()}
        />
        <input
          type="file"
          accept="image/*"
          id="profilePictureInput"
          style={{ display: "none" }}
          onChange={handleProfilePictureChange}
        />
        <div>
          <Input
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <Input
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <Button
          sx={{ marginTop: 5 }}
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdateProfile;
