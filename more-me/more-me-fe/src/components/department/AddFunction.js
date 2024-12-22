// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   FormControl,
//   FormHelperText,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   Button,
// } from "@mui/material";
// import { getCompanyFunctions, createFunction, updateFunction } from "src/api";

// import { useAuth } from "src/context/AuthContext";
// import { getAllCompanyUser } from "src/api";
// import { toast } from "react-toastify";
// import { get } from "lodash";

// export default function AddFunction({ functionF, handleClose }) {
//   const [companyUsers, setCompanyUsers] = useState([]);

//   const [functionName, setFunctionName] = useState(functionF?.name || "");
//   const [functionDescription, setFunctionDescription] = useState(
//     functionF?.description || ""
//   );
//   const [head, setHead] = useState("");

//   const [functionNameIsValid, setFunctionNameIsValid] = useState(true);
//   const [functionDescriptionIsValid, setFunctionDescriptionIsValid] =
//     useState(true);
//   const [headIsValid, setHeadIsValid] = useState(true);

//   const { userData } = useAuth();
//   const isSuperAdmin = userData.role === "super_admin";

//   useEffect(() => {
//     getAllCompanyUser(userData?.token, userData?.company.id, isSuperAdmin).then(
//       (res) => {
//         console.log("COMPANY USERS", res.data);
//         setCompanyUsers(res.data);
//         setHead(get(functionF, "Head.id", null));
//       }
//     );
//   }, []);

//   const handleAddFunction = async (e) => {
//     e.preventDefault();
//     let noErrors = true;
//     if (!functionName || functionName.length < 3) {
//       setFunctionNameIsValid(false);
//       noErrors = false;
//     } else setFunctionNameIsValid(true);

//     if (!functionDescription || functionDescription.length < 10) {
//       setFunctionDescriptionIsValid(false);
//       noErrors = false;
//     } else setFunctionDescriptionIsValid(true);

//     if (head === null) {
//       setHeadIsValid(false);
//       noErrors = false;
//     } else setHeadIsValid(true);

//     if (!noErrors) return;

//     // When creating new function
//     if (!functionF) {
//       const currentCompanyFunctions = await getCompanyFunctions(
//         userData.token,
//         userData?.company.id
//       );
//       console.log("CURRENT COMPANY FUNCTIONS", currentCompanyFunctions.data);
//       const functionExists = currentCompanyFunctions.data.some(
//         (func) => func.name === functionName
//       );
//       if (functionExists) {
//         toast.error("Function already exists");
//         return;
//       }

//       const response = await createFunction(
//         {
//           name: functionName,
//           description: functionDescription,
//           headId: head,
//           companyId: userData?.company.id,
//         },
//         userData.token
//       );
//       if (response.code === 200) {
//         toast.success("Function added successfully");
//         handleClose()
//       } else {
//         toast.error(response.errorMessage);
//       }
//     }
//     // When updating existing function
//     else {
//       const response = await updateFunction(
//         {
//           id: functionF.id,
//           name: functionName,
//           description: functionDescription,
//           headId: head,
//           companyId: userData?.company.id,
//         },
//         userData.token
//       );
//       if (response.code === 200) {
//         toast.success("Function updated successfully");
//         handleClose()
//       } else {
//         toast.error("Failed to update function");
//       }
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" marginBlock={2}>
//         {functionF
//           ? `Edit Function: ${functionF.name}`
//           : "Add Function to your company"}
//       </Typography>
//       <Box
//         component={"form"}
//         autoComplete="off"
//         noValidate
//         onSubmit={handleAddFunction}
//       >
//         <FormControl className="my-3" fullWidth>
//           <TextField
//             label="Function Name"
//             id="func-name"
//             fullWidth
//             variant="outlined"
//             error={!functionNameIsValid}
//             helperText={
//               functionNameIsValid ? "" : "Enter the name of the function"
//             }
//             value={functionName}
//             onChange={(e) => setFunctionName(e.target.value)}
//           />
//         </FormControl>
//         <FormControl className="my-3" fullWidth>
//           <TextField
//             required
//             fullWidth
//             id="description"
//             multiline
//             rows={6}
//             label="Function Description"
//             name="description"
//             value={functionDescription}
//             onChange={(e) => setFunctionDescription(e.target.value)}
//             error={!functionDescriptionIsValid}
//             helperText={
//               !functionDescriptionIsValid
//                 ? "Enter a bit longer description of the function"
//                 : ""
//             }
//           />
//         </FormControl>
//         <FormControl className="my-3" fullWidth error={!headIsValid}>
//           <InputLabel id="dept-head-label">Head of Function</InputLabel>
//           <Select
//             labelId="dept-head-label"
//             id="func-head"
//             label="Head of Department"
//             fullWidth
//             value={head}
//             onChange={(e) => setHead(e.target.value)}
//           >
//             {companyUsers.map((user) => (
//               <MenuItem key={user.id} value={user.id}>
//                 {user.firstName} {user.lastName}
//               </MenuItem>
//             ))}
//           </Select>
//           <FormHelperText>
//             {headIsValid ? "" : "Select the head of the function"}
//           </FormHelperText>
//         </FormControl>
//         <Box marginBlock={2}>
//           <Button variant="contained" color="primary" type="submit">
//             {functionF ? "Update" : "Add"}
//             Function
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";
import { getCompanyFunctions, createFunction, updateFunction } from "src/api";

import { useAuth } from "src/context/AuthContext";
import { getAllCompanyUser } from "src/api";
import { toast } from "react-toastify";
import { get } from "lodash";

export default function AddFunction({ functionF, handleClose }) {
  const [companyUsers, setCompanyUsers] = useState([]);

  const [functionName, setFunctionName] = useState(functionF?.name || "");
  const [functionDescription, setFunctionDescription] = useState(
    functionF?.description || ""
  );
  const [head, setHead] = useState("");

  const [functionNameIsValid, setFunctionNameIsValid] = useState(true);
  const [functionDescriptionIsValid, setFunctionDescriptionIsValid] =
    useState(true);
  const [headIsValid, setHeadIsValid] = useState(true);
  const [isUniqueFunctionName, setIsUniqueFunctionName] = useState(true);

  const { userData } = useAuth();
  const isSuperAdmin = userData.role === "super_admin";

  useEffect(() => {
    getAllCompanyUser(userData?.token, userData?.company.id, isSuperAdmin).then(
      (res) => {
        console.log("COMPANY USERS", res.data);
        setCompanyUsers(res.data);
        setHead(get(functionF, "Head.id", null));
      }
    );
  }, []);

  const handleAddFunction = async (e) => {
    e.preventDefault();
    let noErrors = true;
    const currentCompanyFunctions = await getCompanyFunctions(
      userData.token,
      userData?.company.id
    );
    console.log("CURRENT COMPANY FUNCTIONS", currentCompanyFunctions.data);
    const functionExists = currentCompanyFunctions.data.some(
      (func) => func.name === functionName && func.id !== functionF?.id
    );
    setIsUniqueFunctionName(!functionExists);

    if (functionExists) {
      toast.error("Function already exists");
      noErrors = false;
    }

    if (!functionName || functionName.length < 3) {
      setFunctionNameIsValid(false);
      noErrors = false;
    } else setFunctionNameIsValid(true);

    if (!functionDescription || functionDescription.length < 10) {
      setFunctionDescriptionIsValid(false);
      noErrors = false;
    } else setFunctionDescriptionIsValid(true);

    if (head === null) {
      setHeadIsValid(false);
      noErrors = false;
    } else setHeadIsValid(true);

    if (!noErrors) return;

    // When creating new function
    if (!functionF) {
      const response = await createFunction(
        {
          name: functionName,
          description: functionDescription,
          headId: head,
          companyId: userData?.company.id,
        },
        userData.token
      );
      if (response.code === 200) {
        toast.success("Function added successfully");
        handleClose();
      } else {
        toast.error(response.errorMessage);
      }
    }
    // When updating existing function
    else {
      console.log("function id", functionF.id);
      const response = await updateFunction(
        {
          id: functionF.id,
          name: functionName,
          description: functionDescription,
          headId: head,
          companyId: userData?.company.id,
        },
        userData.token
      );
      console.log("response of update a function", response);
      if (response.code === 200) {
        toast.success("Function updated successfully");
        handleClose();
      } else {
        toast.error("Failed to update function");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" marginBlock={2}>
        {functionF
          ? `Edit Function: ${functionF.name}`
          : "Add Function to your company"}
      </Typography>
      <Box
        component={"form"}
        autoComplete="off"
        noValidate
        onSubmit={handleAddFunction}
      >
        <FormControl className="my-3" fullWidth>
          <TextField
            label="Function Name"
            id="func-name"
            fullWidth
            variant="outlined"
            error={!functionNameIsValid || !isUniqueFunctionName}
            helperText={
              !functionNameIsValid
                ? "Enter the name of the function"
                : !isUniqueFunctionName
                ? "Function name already exists"
                : ""
            }
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </FormControl>
        <FormControl className="my-3" fullWidth>
          <TextField
            required
            fullWidth
            id="description"
            multiline
            rows={6}
            label="Function Description"
            name="description"
            value={functionDescription}
            onChange={(e) => setFunctionDescription(e.target.value)}
            error={!functionDescriptionIsValid}
            helperText={
              !functionDescriptionIsValid
                ? "Enter a bit longer description of the function"
                : ""
            }
          />
        </FormControl>
        <FormControl className="my-3" fullWidth error={!headIsValid}>
          <InputLabel id="dept-head-label">Head of Function</InputLabel>
          <Select
            labelId="dept-head-label"
            id="func-head"
            label="Head of Department"
            fullWidth
            value={head}
            onChange={(e) => setHead(e.target.value)}
          >
            {companyUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {headIsValid ? "" : "Select the head of the function"}
          </FormHelperText>
        </FormControl>
        <Box marginBlock={2}>
          <Button variant="contained" color="primary" type="submit">
            {functionF ? "Update" : "Add"} Function
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
