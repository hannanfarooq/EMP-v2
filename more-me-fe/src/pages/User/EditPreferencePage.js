// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Autocomplete,
//   Chip,
//   FormControlLabel,
//   Checkbox,
//   FormGroup,
// } from "@mui/material";
// import { getUserStartUpQuestions, updateStartUpQuestions } from 'src/api';
// import { toast } from 'react-toastify';


// const EditPreferencePage = () => {
//   // Default hobbies and topics
//   const defaultHobbies = [
//     'Cooking', 'Baking', 'Reading', 'Outdoor activities', 'Tech/Computers', 
//     'Traveling', 'Socializing', 'Gaming', 'Gardening', 'DIY', 'Arts', 
//     'Writing', 'Photography'
//   ];

//   const defaultTopics = [
//     'Inspiration', 'Leadership', 'Human behaviour', 'Self-care', 'Physical wellbeing',
//     'Mental wellbeing', 'Finance', 'Nutrition', 'Mindfulness'
//   ];

//   const [questions, setQuestions] = useState([]);
//   const [hobbies, setHobbies] = useState([]);
//   const [interestTopics, setInterestTopics] = useState([]);
//   const [contentPreferences, setContentPreferences] = useState([]);
//   const [error, setError] = useState(false);
//   const [maxError, setMaxError] = useState(false);

//   const currentUserData = React.useMemo(() => JSON.parse(localStorage.getItem("currentUser")), []);
//   const isCompanyUser = currentUserData.user.role === 'user';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getUserStartUpQuestions(
//           currentUserData?.token,
//           currentUserData?.company.id,
//           currentUserData?.user.id,
//           isCompanyUser
//         );

//         const questionData = response.data[0]; // Assuming the data array has at least one item
//         setQuestions([
//           { label: 'Hobbies', value: questionData.hobbies },
//           { label: 'Interest Topics', value: questionData.interestTopics },
//         ]);

//         const hobbiesArray = questionData.hobbies ? questionData.hobbies.split(',') : [];
//         setHobbies(hobbiesArray);

//         const interestTopicsArray = questionData.interestTopics ? questionData.interestTopics.split(',') : [];
//         setInterestTopics(interestTopicsArray);

//         const contentPreferencesArray = questionData.contentPreferences ? questionData.contentPreferences.split(',') : [];
//         setContentPreferences(contentPreferencesArray);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
    
//     fetchData();
//   }, [currentUserData, isCompanyUser]);

//   const handleHobbyChange = (event, newValue) => {
//     if (newValue.length > 5) {
//       setMaxError(true);
//       return;
//     }
//     setMaxError(false);
//     const uniqueHobbies = newValue.filter((hobby, index) => newValue.indexOf(hobby) === index);
//     setHobbies(uniqueHobbies);
//     setError(false);
//   };

//   const handleInterestTopicsChange = (event, newValue) => {
//     if (newValue.length > 5) {
//       setMaxError(true);
//       return;
//     }
//     const uniqueTopics = newValue.filter((topic, index) => newValue.indexOf(topic) === index);
//     setInterestTopics(uniqueTopics);
//     setMaxError(false);
//   };

//   const handleContentPreferenceChange = (event) => {
//     const { value } = event.target;
//     if (contentPreferences.length < 7 || contentPreferences.includes(value)) {
//       setContentPreferences((prev) =>
//         prev.includes(value) ? prev.filter((pref) => prev !== value) : [...prev, value]
//       );
//     } else {
//       setMaxError(true);
//     }
//   };

//   const handleSubmit = async () => {
//     if (hobbies.length === 0 || interestTopics.length === 0) {
//       setError(true);
//       return;
//     }

//     const answer = {
//       hobbies,
//       interestTopics,
//       contentPreferences,
//     };

//     console.log("Submitting answer:", answer);
//     const finalAnswerPersona = {
//       ...answer,
//       userId: currentUserData.user.id,
//       companyId: currentUserData.user.companyId,
//     };
//     await updateStartUpQuestions(finalAnswerPersona, currentUserData.token);
//     toast.success("Startup questions added successfully");
//     window.location.reload();
//   };

//   return (
//     <Card style={{ height: "80vh", overflowY: "auto" }}>
//       <CardContent>
//         <Typography variant="h4" component="h2" gutterBottom>
//           Update Preference
//         </Typography>
//         <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//           <Autocomplete
//             multiple
//             freeSolo
//             openOnFocus
//             id="hobbies-autocomplete"
//             options={defaultHobbies}
//             value={hobbies}
//             onChange={handleHobbyChange}
//             filterSelectedOptions
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 variant="outlined"
//                 label="Search hobbies"
//                 placeholder="Hobbies"
//                 error={error || maxError}
//                 helperText={
//                   error ? 'Please select at least one hobby' : 
//                   maxError ? 'You can select a maximum of 7 hobbies' : ''
//                 }
//               />
//             )}
//             renderTags={(value, getTagProps) =>
//               value.map((option, index) => (
//                 <Chip label={option} {...getTagProps({ index })} />
//               ))
//             }
//             style={{ width: '100%' }}
//           />
//           <Autocomplete
//             multiple
//             freeSolo
//             openOnFocus
//             id="topics-autocomplete"
//             options={defaultTopics}
//             value={interestTopics}
//             onChange={handleInterestTopicsChange}
//             filterSelectedOptions
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 variant="outlined"
//                 label="Search interest topics"
//                 placeholder="Interest Topics"
//                 error={maxError}
//                 helperText={
//                   maxError ? 'You can select a maximum of 7 interest topics' : ''
//                 }
//               />
//             )}
//             renderTags={(value, getTagProps) =>
//               value.map((option, index) => (
//                 <Chip label={option} {...getTagProps({ index })} />
//               ))
//             }
//             style={{ width: '100%' }}
//           />
//           <FormGroup style={{marginRight:"auto"}}>
//             <Typography variant="h6" component="h4" gutterBottom>
//               Content Preferences
//             </Typography>
//             {['Reading', 'Video', 'Podcast'].map((option) => (
//               <FormControlLabel
//                 key={option}
//                 control={
//                   <Checkbox
//                     checked={contentPreferences.includes(option)}
//                     onChange={handleContentPreferenceChange}
//                     value={option}
//                   />
//                 }
//                 label={option}
//               />
//             ))}
//           </FormGroup>
//           <Button
//             onClick={handleSubmit}
//             fullWidth
//             sx={{ marginTop: 2 }}
//             variant="contained"
//             color="primary"
//             style={{position:"absolute", bottom:"20px", width:"91%"}}
//           >
//             Update
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default EditPreferencePage;

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Autocomplete,
//   Chip,
//   FormControlLabel,
//   Checkbox,
//   FormGroup,
// } from "@mui/material";
// import { getUserStartUpQuestions, updateStartUpQuestions } from 'src/api';
// import { toast } from 'react-toastify';

// const EditPreferencePage = () => {
//   // Default hobbies and topics
//   const defaultHobbies = [
//     'Cooking', 'Baking', 'Reading', 'Outdoor activities', 'Tech/Computers', 
//     'Traveling', 'Socializing', 'Gaming', 'Gardening', 'DIY', 'Arts', 
//     'Writing', 'Photography'
//   ];

//   const defaultTopics = [
//     'Inspiration', 'Leadership', 'Human behaviour', 'Self-care', 'Physical wellbeing',
//     'Mental wellbeing', 'Finance', 'Nutrition', 'Mindfulness'
//   ];

//   const [questions, setQuestions] = useState([]);
//   const [hobbies, setHobbies] = useState([]);
//   const [interestTopics, setInterestTopics] = useState([]);
//   const [contentPreferences, setContentPreferences] = useState([]);
//   const [error, setError] = useState(false);
//   const [maxError, setMaxError] = useState(false);

//   const currentUserData = React.useMemo(() => JSON.parse(localStorage.getItem("currentUser")), []);
//   const isCompanyUser = currentUserData.user.role === 'user';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getUserStartUpQuestions(
//           currentUserData?.token,
//           currentUserData?.company.id,
//           currentUserData?.user.id,
//           isCompanyUser
//         );

//         const questionData = response.data[0];
//         setQuestions([
//           { label: 'Hobbies', value: questionData.hobbies },
//           { label: 'Interest Topics', value: questionData.interestTopics },
//         ]);

//         const hobbiesArray = questionData.hobbies ? questionData.hobbies.split(',') : [];
//         setHobbies(hobbiesArray);

//         const interestTopicsArray = questionData.interestTopics ? questionData.interestTopics.split(',') : [];
//         setInterestTopics(interestTopicsArray);

//         const contentPreferencesArray = questionData.contentPreferences ? questionData.contentPreferences.split(',') : [];
//         setContentPreferences(contentPreferencesArray);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
    
//     fetchData();
//   }, [currentUserData, isCompanyUser]);

//   const handleHobbyChange = (event, newValue) => {
//     if (newValue.length > 5) {
//       setMaxError(true);
//       return;
//     }
//     setMaxError(false);
//     const uniqueHobbies = newValue.filter((hobby, index) => newValue.indexOf(hobby) === index);
//     setHobbies(uniqueHobbies);
//     setError(false);
//   };

//   const handleInterestTopicsChange = (event, newValue) => {
//     if (newValue.length > 5) {
//       setMaxError(true);
//       return;
//     }
//     const uniqueTopics = newValue.filter((topic, index) => newValue.indexOf(topic) === index);
//     setInterestTopics(uniqueTopics);
//     setMaxError(false);
//   };

//   // Updated function to handle content preferences toggle
//   const handleContentPreferenceChange = (event) => {
//     const { value } = event.target;
//     setContentPreferences((prev) => 
//       prev.includes(value) 
//         ? prev.filter((pref) => pref !== value) // Remove if already selected
//         : [...prev, value] // Add if not selected
//     );
//   };

//   const handleSubmit = async () => {
//     if (hobbies.length === 0 || interestTopics.length === 0) {
//       setError(true);
//       return;
//     }

//     const answer = {
//       hobbies,
//       interestTopics,
//       contentPreferences,
//     };

//     console.log("Submitting answer:", answer);
//     const finalAnswerPersona = {
//       ...answer,
//       userId: currentUserData.user.id,
//       companyId: currentUserData.user.companyId,
//     };

//     try {
//       await updateStartUpQuestions(finalAnswerPersona, currentUserData.token);
//       toast.success("Startup questions updated successfully");
//       window.location.reload();
//     } catch (error) {
//       console.error("Failed to update startup questions", error);
//       toast.error("Failed to update startup questions");
//     }
//   };

//   return (
//     <Card style={{ height: "80vh", overflowY: "auto" }}>
//       <CardContent>
//         <Typography variant="h4" component="h2" gutterBottom>
//           Update Preference
//         </Typography>
//         <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//           <Autocomplete
//             multiple
//             freeSolo
//             openOnFocus
//             id="hobbies-autocomplete"
//             options={defaultHobbies}
//             value={hobbies}
//             onChange={handleHobbyChange}
//             filterSelectedOptions
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 variant="outlined"
//                 label="Search hobbies"
//                 placeholder="Hobbies"
//                 error={error || maxError}
//                 helperText={
//                   error ? 'Please select at least one hobby' : 
//                   maxError ? 'You can select a maximum of 7 hobbies' : ''
//                 }
//               />
//             )}
//             renderTags={(value, getTagProps) =>
//               value.map((option, index) => (
//                 <Chip label={option} {...getTagProps({ index })} />
//               ))
//             }
//             style={{ width: '100%' }}
//           />
//           <Autocomplete
//             multiple
//             freeSolo
//             openOnFocus
//             id="topics-autocomplete"
//             options={defaultTopics}
//             value={interestTopics}
//             onChange={handleInterestTopicsChange}
//             filterSelectedOptions
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 variant="outlined"
//                 label="Search interest topics"
//                 placeholder="Interest Topics"
//                 error={maxError}
//                 helperText={
//                   maxError ? 'You can select a maximum of 7 interest topics' : ''
//                 }
//               />
//             )}
//             renderTags={(value, getTagProps) =>
//               value.map((option, index) => (
//                 <Chip label={option} {...getTagProps({ index })} />
//               ))
//             }
//             style={{ width: '100%' }}
//           />
//           <FormGroup style={{ marginRight: "auto" }}>
//             <Typography variant="h6" component="h4" gutterBottom>
//               Content Preferences
//             </Typography>
//             {['Reading', 'Video', 'Podcast'].map((option) => (
//               <FormControlLabel
//                 key={option}
//                 control={
//                   <Checkbox
//                     checked={contentPreferences.includes(option)}
//                     onChange={handleContentPreferenceChange}
//                     value={option}
//                   />
//                 }
//                 label={option}
//               />
//             ))}
//           </FormGroup>
//           <Button
//             onClick={handleSubmit}
//             fullWidth
//             sx={{ marginTop: 2 }}
//             variant="contained"
//             color="primary"
//             style={{ position: "absolute", bottom: "20px", width: "91%" }}
//           >
//             Update
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default EditPreferencePage;

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  Chip,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { getUserStartUpQuestions, updateStartUpQuestions } from 'src/api';
import { toast } from 'react-toastify';

const EditPreferencePage = () => {
  const defaultHobbies = [
    'Cooking', 'Baking', 'Reading', 'Outdoor activities', 'Tech/Computers', 
    'Traveling', 'Socializing', 'Gaming', 'Gardening', 'DIY', 'Arts', 
    'Writing', 'Photography'
  ];

  const defaultTopics = [
    'Inspiration', 'Leadership', 'Human behaviour', 'Self-care', 'Physical wellbeing',
    'Mental wellbeing', 'Finance', 'Nutrition', 'Mindfulness'
  ];

  const defaultInspirations = [
    'Thought Leader: Simon Sinek',
    'Innovator: Elon Musk',
    'Peace Activist: Nelson Mandela',
    'Visionary: Steve Jobs',
    'Philanthropist: Bill Gates',
    'Motivational Speaker: Tony Robbins',
    'Environmentalist: Greta Thunberg',
    'Human Rights Advocate: Malala Yousafzai',
    'Author: Brené Brown',
    'Entrepreneur: Richard Branson'
  ];
  
  const [hobbies, setHobbies] = useState([]);
  const [interestTopics, setInterestTopics] = useState([]);
  const [contentPreferences, setContentPreferences] = useState([]);
  const [inspirations, setInspirations] = useState([]);
  const [hobbiesError, setHobbiesError] = useState('');
  const [topicsError, setTopicsError] = useState('');
  const [contentPreferencesError, setContentPreferencesError] = useState('');
  const [inspirationsError, setInspirationsError] = useState('');
  const [maxError, setMaxError] = useState(false);

  const currentUserData = React.useMemo(() => JSON.parse(localStorage.getItem("currentUser")), []);
  const isCompanyUser = currentUserData.user.role === 'user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserStartUpQuestions(
          currentUserData?.token,
          currentUserData?.company.id,
          currentUserData?.user.id,
          isCompanyUser
        );

        const questionData = response.data[0];
        setHobbies(questionData.hobbies ? questionData.hobbies.split(',') : []);
        setInterestTopics(questionData.interestTopics ? questionData.interestTopics.split(',') : []);
        setContentPreferences(questionData.contentPreferences ? questionData.contentPreferences.split(',') : []);
        setInspirations(questionData.lifePrincipleInspirations ? questionData.lifePrincipleInspirations.split(',') : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUserData, isCompanyUser]);

  const handleHobbyChange = (event, newValue) => {
    if (newValue.length > 5) {
      setMaxError(true);
      return;
    }
    setMaxError(false);
    setHobbies(newValue);
    setHobbiesError('');
  };

  const handleInterestTopicsChange = (event, newValue) => {
    if (newValue.length > 7) {
      setMaxError(true);
      return;
    }
    setMaxError(false);
    setInterestTopics(newValue);
    setTopicsError('');
  };

  const handleContentPreferenceChange = (event) => {
    const { value } = event.target;
    setContentPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((pref) => pref !== value)
        : [...prev, value]
    );
    setContentPreferencesError('');
  };

  const handleInspirationsChange = (event, newValue) => {
    if (newValue.length > 7) {
      setMaxError(true);
      return;
    }
    setMaxError(false);
    setInspirations(newValue);
    setInspirationsError('');
  };

  const handleSubmit = async () => {
    if (hobbies.length === 0) {
      setHobbiesError('Please select at least one hobby.');
    }

    if (interestTopics.length === 0) {
      setTopicsError('Please select at least one interest topic.');
    }

    if (contentPreferences.length === 0) {
      setContentPreferencesError('Please select at least one content preference.');
    }

    if (inspirations.length === 0) {
      setInspirationsError('Please select at least one inspiration.');
    }

    if (hobbies.length === 0 || interestTopics.length === 0 || contentPreferences.length === 0 || inspirations.length === 0) {
      return;
    }

    const answer = {
      hobbies,
      interestTopics,
      contentPreferences,
      lifePrincipleInspirations: inspirations,
    };
    console.log("updated answers", answer);

    const finalAnswerPersona = {
      ...answer,
      userId: currentUserData.user.id,
      companyId: currentUserData.user.companyId,
    };

    try {
      await updateStartUpQuestions(finalAnswerPersona, currentUserData.token);
      toast.success("Startup questions updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update startup questions", error);
      toast.error("Failed to update startup questions");
    }
  };
 
  return (
    <Card style={{ height: "80vh", overflowY: "auto" }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          Update Preference
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Autocomplete
            style={{width:"100%"}}
            multiple
            freeSolo
            openOnFocus
            id="hobbies-autocomplete"
            options={defaultHobbies}
            value={hobbies}
            onChange={handleHobbyChange}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Search hobbies"
                placeholder="Hobbies"
                error={!!hobbiesError || maxError}
                helperText={hobbiesError || (maxError ? 'You can select a maximum of 5 hobbies' : '')}
              />
            )}
          />
          <Autocomplete
            style={{width:"100%"}}
            multiple
            freeSolo
            openOnFocus
            id="topics-autocomplete"
            options={defaultTopics}
            value={interestTopics}
            onChange={handleInterestTopicsChange}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Search interest topics"
                placeholder="Interest Topics"
                error={!!topicsError || maxError}
                helperText={topicsError || (maxError ? 'You can select a maximum of 5 interest topics' : '')}
              />
            )}
          />
          <Autocomplete
            style={{width:"100%"}}
            multiple
            freeSolo
            openOnFocus
            id="inspirations-autocomplete"
            options={defaultInspirations}
            value={inspirations}
            onChange={handleInspirationsChange}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Search inspirations and life principles"
                placeholder="Inspirations"
                error={!!inspirationsError || maxError}
                helperText={inspirationsError || (maxError ? 'You can select a maximum of 5 inspirations' : '')}
              />
            )}
          />
          <FormGroup style={{ marginRight: "auto" }}>
            <Typography variant="h6" component="h4" gutterBottom>
              Content Preferences
            </Typography>
            {['Reading Books', 'Reading Articles', 'Watching video clips', 'Listening to Podcast', 'Webinars or conferences'].map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={contentPreferences.includes(option)}
                    onChange={handleContentPreferenceChange}
                    value={option}
                  />
                }
                label={option}
              />
            ))}
            {contentPreferencesError && (
              <Typography variant="caption" color="error">
                {contentPreferencesError}
              </Typography>
            )}
          </FormGroup>
          <Button
            onClick={handleSubmit}
            fullWidth
            sx={{ marginTop: 2 }}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditPreferencePage;
