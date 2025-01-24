import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Button,
  Typography,
  TextField,
  Grid,
  IconButton,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { UpdateUser, getUserProfile } from "src/api";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(true);

  // Form State
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [spouse, setSpouse] = useState(null);
  const [childrenNames, setChildrenNames] = useState([]);
  const [childrenDOBs, setChildrenDOBs] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
      if (storedUserData) {
        try {
          const UserData = await getUserProfile(
            storedUserData?.user?.id,
            storedUserData.token
          );
          console.log("UserData get", UserData.data.user);
          const showData = UserData.data.user;
          setUser(UserData);
          setProfilePicture(showData.profilePic || "");
          setFirstName(showData.firstName || "");
          setLastName(showData.lastName || "");
          setEmail(showData.email || "");
          setGender(showData.gender || "");
          setDob(showData.dateOfBirth ? new Date(showData.dateOfBirth).toISOString().split('T')[0] : "");
          setAddress(showData.address || "");
          setCity(showData.city || "");
          setCountry(showData.country || "");
          setPhoneNumber(showData.phoneNumber || "");
          setMaritalStatus(showData.spouseName || "Single");
          setSpouse(showData.spouseName ? { name: showData.spouseName, dob: new Date(showData.spouseDOB).toISOString().split('T')[0] } : null);
          setChildrenNames(showData.childrenNames || []);
          setChildrenDOBs(showData.childrenDOBs ? showData.childrenDOBs.map(date => new Date(date).toISOString().split('T')[0]) : []);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch user data", error);
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    console.log("image file", file);

    if (file) {
      setLoading(true);
      const imageUrl = await uploadImageAndGetURL(file);
      if (imageUrl) {
        setProfilePicture(imageUrl);
      }
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const currentUserData = JSON.parse(localStorage.getItem("currentUser"));
    if (!firstName || !lastName || !email || !gender || !dob || !address || !city || !country || !phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const updatedUser = {
      id: currentUserData.user.id,
      firstName,
      lastName,
      profilePic: profilePicture,
      email,
      gender,
      dateOfBirth: dob,
      address,
      city,
      country,
      phoneNumber,
      maritalStatus,
      spouseName: spouse ? spouse.name : null,
      spouseDOB: spouse ? spouse.dob : null,
      childrenNames,
      childrenDOBs,
    };

    console.log("Updated User Object:", updatedUser);

    try {
      const updateUserdata = await UpdateUser(updatedUser);
      if (updateUserdata.data) {
        const updatedUserData = { ...currentUserData, user: updateUserdata.data };
        localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
        setEditMode(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update user data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChildChange = (index, field, value) => {
    if (field === "name") {
      const updatedChildrenNames = [...childrenNames];
      updatedChildrenNames[index] = value;
      setChildrenNames(updatedChildrenNames);
    } else if (field === "dob") {
      const updatedChildrenDOBs = [...childrenDOBs];
      updatedChildrenDOBs[index] = value;
      setChildrenDOBs(updatedChildrenDOBs);
    }
  };

  const handleAddChild = () => {
    setChildrenNames([...childrenNames, ""]);
    setChildrenDOBs([...childrenDOBs, ""]);
  };

  const handleRemoveChild = (index) => {
    const updatedChildrenNames = childrenNames.filter((_, i) => i !== index);
    const updatedChildrenDOBs = childrenDOBs.filter((_, i) => i !== index);
    setChildrenNames(updatedChildrenNames);
    setChildrenDOBs(updatedChildrenDOBs);
  };

  const handleAddSpouse = () => {
    setSpouse({ name: "", dob: "" });
  };

  const handleSpouseChange = (field, value) => {
    setSpouse({ ...spouse, [field]: value });
  };

  const handleRemoveSpouse = () => {
    setSpouse(null);
  };

  const handleMaritalStatusChange = (e) => {
    const status = e.target.value;
    setMaritalStatus(status);
    if (status === "Single") {
      setSpouse(null);
    } else {
      setSpouse(spouse || { name: "", dob: "" });
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Typography>No user data found</Typography>;
  }

  return (
    <Card style={{ height: "80vh", overflowY: "auto", background:"white !important" }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          Update Profile
        </Typography>
        <Grid container spacing={2}>
          {/* Profile Picture Row */}
          <Grid item xs={12} container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={profilePicture}
                alt="Profile"
              />
            </Grid>
            <Grid item>
              <Button component="label" color="primary">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePictureChange}
                />
              </Button>
            </Grid>
          </Grid>

          {/* First Name and Last Name Row */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <TextField
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                placeholder="Enter your first name"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <TextField
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                placeholder="Enter your last name"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          {/* Email Row */}
          <Grid item xs={12}>
            <Box mb={2}>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                placeholder="Enter your email address"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          {/* Gender and DOB Row */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <FormControl fullWidth required>
                <InputLabel shrink={true}>Gender</InputLabel>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              {/* <TextField
                label="Date of Birth"
                variant="outlined"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                fullWidth
                placeholder="Select your date of birth"
                required
                InputLabelProps={{ shrink: true }}
              /> */}
              <TextField
                label="Date of Birth"
                variant="outlined"
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  e.target.blur(); // Programmatically blur the input to close the date picker on Safari
                }}
                fullWidth
                placeholder="Select your date of birth"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          {/* Address, City, Country Row */}
          <Grid item xs={12} sm={4}>
            <Box mb={2}>
              <TextField
                label="Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                placeholder="Enter your address"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box mb={2}>
              <TextField
                label="City"
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                placeholder="Enter your city"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box mb={2}>
              <TextField
                label="Country"
                variant="outlined"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                fullWidth
                placeholder="Enter your country"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          {/* Phone Number Row */}
          <Grid item xs={12}>
            <Box mb={2}>
              <TextField
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                placeholder="Enter your phone number"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          {/* Children Details Row */}
          <Grid item xs={12}>
            <Typography style={{marginBottom:"10px"}} variant="h6">Children</Typography>
            {childrenNames.map((name, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} sm={5}>
                  <Box mb={2}>
                    <TextField
                      label="Child Name"
                      variant="outlined"
                      value={name}
                      onChange={(e) => handleChildChange(index, "name", e.target.value)}
                      fullWidth
                      placeholder="Enter child's name"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Box mb={2}>
                    {/* <TextField
                      label="Child DOB"
                      variant="outlined"
                      type="date"
                      value={childrenDOBs[index]}
                      onChange={(e) => handleChildChange(index, "dob", e.target.value)}
                      fullWidth
                      placeholder="Select child's date of birth"
                      InputLabelProps={{ shrink: true }}
                    /> */}
                    <TextField
                      label="Child DOB"
                      variant="outlined"
                      type="date"
                      value={childrenDOBs[index]}
                      onChange={(e) => {
                        handleChildChange(index, "dob", e.target.value);
                        e.target.blur(); // Programmatically blur the input to close the date picker on Safari
                      }}
                      fullWidth
                      placeholder="Select child's date of birth"
                      InputLabelProps={{ shrink: true }}
                    />

                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box mb={2}>
                    <IconButton onClick={() => handleRemoveChild(index)}>
                      <RemoveCircle color="error" />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddCircle />} onClick={handleAddChild}>
              Add Child
            </Button>
          </Grid>

          {/* Marital Status Row */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <FormControl fullWidth required>
                <InputLabel shrink={true}>Marital Status</InputLabel>
                <Select
                  value={maritalStatus}
                  onChange={handleMaritalStatusChange}
                  displayEmpty
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Engaged">Engaged</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Spouse Details Row */}
          {maritalStatus !== "Single" && (
            <Grid item xs={12}>
              <Typography style={{marginBottom:"10px"}} variant="h6">Spouse</Typography>
              {spouse ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={5}>
                    <Box mb={2}>
                      <TextField
                        label="Spouse Name"
                        variant="outlined"
                        value={spouse.name}
                        onChange={(e) => handleSpouseChange("name", e.target.value)}
                        fullWidth
                        placeholder="Enter spouse's name"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Box mb={2}>
                      {/* <TextField
                        label="Spouse DOB"
                        variant="outlined"
                        type="date"
                        value={spouse.dob}
                        onChange={(e) => handleSpouseChange("dob", e.target.value)}
                        fullWidth
                        placeholder="Select spouse's date of birth"
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      <TextField
                        label="Spouse DOB"
                        variant="outlined"
                        type="date"
                        value={spouse.dob}
                        onChange={(e) => {
                          handleSpouseChange("dob", e.target.value);
                          e.target.blur(); // Programmatically blur the input to close the date picker on Safari
                        }}
                        fullWidth
                        placeholder="Select spouse's date of birth"
                        InputLabelProps={{ shrink: true }}
                      />

                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box mb={2}>
                      <IconButton onClick={handleRemoveSpouse}>
                        <RemoveCircle color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Button startIcon={<AddCircle />} onClick={handleAddSpouse}>
                  Add Spouse
                </Button>
              )}
            </Grid>
          )}

          {/* Update Button */}
          <Grid item xs={12}>
            <Button
              sx={{ marginTop: 2 }}
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={loading}
              fullWidth
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
