// // api.js

// import { ContactlessOutlined } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import { baseURL } from "src/utils/baseURL";

// export const Login = async (email, password) => {
//   const apiUrl = "/pub/login";

//   const requestData = {
//     email: email,
//     password: password,
//   };
//   console.log("requestData", requestData);
//   try {
//     const res = await fetch(baseURL + apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestData),
//     });
//     if (res.ok) {
//       const data = await res.json();
//       return {
//         error: false,
//         status: 200,
//         data: data,
//       };
//     } else {
//       const data = await res.json();
//       return {
//         error: true,
//         status: 200,
//         data: data,
//       };
//     }
//   } catch (error) {
//     return {
//       error: true,
//       status: 400,
//       data: error,
//     };
//   }
// };

// export const sendEmail = async (data) => {
//   const apiUrl = "/pub/sendEmail";

//   try {
//     const res = await fetch(baseURL + apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const resp = await res.json();
//   } catch (error) {
//     return {
//       error: true,
//       status: 400,
//       data: error,
//     };
//   }
// };

// export const handleDeleteCompany = async (questionId, token) => {
//   const apiUrl = "/api/admin/deleteCompany";
//   const requestData = {
//     questionId: questionId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
// };

// //delete question based on company id
// export const deleteDynamicQuestion = async (questionId, companyId, token) => {
//   const apiUrl = "/api/companyAdmin/deleteDynamicQuestion";
//   const requestData = {
//     questionId: questionId,
//     companyId: companyId, // Include company ID
//   };
//   console.log("requestData", token);
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(requestData),
//   });
//   if (!res.ok) {
//     const errorMessage = await res.text();
//     throw new Error(errorMessage);
//   }
//   return res.json();
// };


// export const UpdateCompany = async (data, token) => {
//   const apiUrl = "/api/admin/updateCompany";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const GetAllCompanies = async (token) => {
//   const apiUrl = "/api/admin/allCompanies";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//   });
//   return res.json();
// };

// export const inviteBulkUsers = async (token, usersData) => {
//   const apiUrl = "/api/inviteUsersCSV";
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const data = { users: usersData, companyId: currentUser.company.id };

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   return res.json();
// };

// // create company policy
// export const createCompanyPolicy = async (data, token) => {
//   const apiUrl = "/api/companyAdmin/createCompanyPolicy";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //createUserAttemptQuestionnaire
// export const createUserAttemptQuestionnaire = async (companyId, userId, questionnaireId, token, questionnareData) => {
//   const apiUrl = "/api/createUserAttemptQuestionnaire";
//   const data = {
//     companyId: companyId,
//     userId: userId,
//     questionnaireId: questionnaireId,
//     questionnareData: questionnareData,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const getAllCompanyPolicies = async (token, companyId) => {
//   const apiUrl = "/api/companyAdmin/allCompanyPolicy";
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const UpdatePolicy = async (data, token) => {
//   const apiUrl = "/api/companyAdmin/updateCompanyPolicy";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const handleDeleteCompanyPolicy = async (companyId, token) => {
//   const apiUrl = "/api/companyAdmin/deleteCompanyPolicy";

//   const requestData = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
// };

// //
// export const getAllCompanyUser = async (token, companyId, superAdmin) => {
//   const apiUrl = `/api/${superAdmin ? 'admin' : 'companyAdmin'}/getAllUserByCompanyId`;
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //get all user daily question
// export const getAllDailyQuestions = async (token, companyId) => {
//   const apiUrl = "/api/companyAdmin/getAllDailyQuestionsByCompanyId";
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   console.log("api/index file", res);
//   return res.json();
// };

// export const getUserStartUpQuestions = async (token, companyId, userId) => {
//   const apiUrl = "/api/getAllStartUpQuestionsByCompanyIdAndUserId";
//   const data = {
//     companyId: companyId,
//     userId: userId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   console.log("api/index file", res);
//   return res.json();
// };

// export const getCompanyData = async (token, companyId) => {
//   const apiUrl = `/api/admin/company`;
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const getAllAdmins = async (token) => {
//   const apiUrl = "/api/companyAdmin/getAllAdmins";
//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//   });
//   return res.json();
// };

// export const UpdateCompanyUser = async (data, token, superAdmin) => {
//   const apiUrl = `/api/${superAdmin ? 'admin' : 'companyAdmin'}/updateUser`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };
// export const updateUserQuestionnaire = async (data, token) => {
//   const apiUrl = "/api/updateUserQuestionnaire";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //updateStartUpQuestions
// export const updateStartUpQuestions = async (data, token) => {
//   const apiUrl = "/api/updateStartUpQuestions";
//   console.log("updated startup data", data);

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const updateUserGamification = async (data, token) => {
//   const apiUrl = "/api/updateUserGamification";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// // department management
// export const createDepartment = async (data, token) => {
//   const apiUrl = "/api/createDepartment";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //create questions on daily basis
// export const createDailyQuestions = async (data, token) => {
//   const apiUrl = "/api/createDailyQuestions";
//   console.log("token:", token);
//   // const data1 = {
//   //   anxietyLevel:data.anxietyLevel,
//   //   feeling: data.feeling,
//   //   reason: data.reason,
//   //   symptom: data.symptom
//   // };
//   try {
//     const res = await fetch(baseURL + apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-token": `${token}`,
//       },
//       body: JSON.stringify(data),
//     });
//     console.log("res", res);
//     // if (!res.ok) {
//     //   throw new Error(`HTTP error! status: ${res.status}`);
//     // }

//     return res.json();
//   } catch (error) {
//     console.error("Error in API call:", error); // Debugging line
//     throw error;
//   }
// };

// //create startup questions
// export const createStartUpQuestions = async (data, token) => {
//   const apiUrl = "/api/createStartUpQuestions";

//   console.log("Data being sent to API:", data);

//   const convertedData = {
//     userId: data.userId,
//     companyId: data.companyId,
//     authorName: data.authorName,
//     bookTitle: data.bookTitle,
//     contentPreferences: data.contentPreferences,
//     engagementMethod: data.engagementMethod,
//     hobbies: data.hobbies,
//     interestTopics: data.interestTopics,
//     lifePrincipleInspirations: data.lifePrincipleInspirations,
//     personalityType: data.personalityType,
//     readingPreference: data.readingPreference,
//     relaxationActivities: data.relaxationActivities,
//   };

//   try {
//     const res = await fetch(baseURL + apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-token": `${token}`,
//       },
//       body: JSON.stringify(convertedData),
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     return res.json();
//   } catch (error) {
//     console.error("Error in API call:", error);
//     throw error;
//   }
// };


// export const getFunctionDepartments = async (token, functionId) => {
//   const apiUrl = "/api/getFunctionDepartments";
//   const data = {
//     functionId: functionId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const deleteDepartment = async (departmentId, token) => {
//   const apiUrl = "/api/deleteDepartment";

//   const requestData = {
//     id: departmentId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
// }

// export const updateDepartment = async (data, token) => {
//   const apiUrl = "/api/updateDepartment";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// // function management
// export const createFunction = async (data, token) => {
//   const apiUrl = "/api/createFunction";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const getCompanyFunctions = async (token, companyId) => {
//   const apiUrl = "/api/getCompanyFunctions";
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const deleteFunction = async (functionId, token) => {
//   const apiUrl = "/api/deleteFunction";

//   const requestData = {
//     id: functionId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
// }

// export const updateFunction = async (data, token) => {
//   const apiUrl = "/api/updateFunction";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const createTeam = async (data, token) => {
//   const apiUrl = "/api/createTeam";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const getDepartmentTeams = async (token, departmentId) => {
//   const apiUrl = "/api/getDepartmentTeams";
//   const data = {
//     departmentId: departmentId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const updateTeam = async (data, token) => {
//   const apiUrl = "/api/updateTeam";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const deleteTeam = async (teamId, token) => {
//   const apiUrl = "/api/deleteTeam";

//   const requestData = {
//     id: teamId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
// }

// export const getTeamMembers = async (token, teamId) => {
//   const apiUrl = "/api/getTeamMembers";
//   const data = {
//     teamId: teamId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": token,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export const handleDeleteCompanyUser = async (userId, token) => {
//   const apiUrl = "/api/companyAdmin/deleteUserById";

//   const requestData = {
//     id: userId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
// };

// export const getUserCompanyPolicy = async (token, companyId) => {
//   const apiUrl = "/api/getCompanyPolicy";
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const updateUserPoints = async (point, userId, policyId, token) => {
//   const apiUrl = "/api/updateUserPoints";
//   const data = {
//     userPolicyId: policyId,
//     userRewards: point,
//     userId: userId,
//   };

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const getUserProfile = async (userId, token) => {
//   const apiUrl = "/api/getUserProfile";
//   const data = {
//     userId: userId,
//   };

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //getUserByCompany
// export const getUserByCompany = async (userId, token) => {
//   const apiUrl = "/api/companyAdmin/getUserProfile";
//   const data = {
//     userId: userId,
//   };

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const createCompanyQuestion = async (data, token) => {
//   const apiUrl = "/api/createQuestions";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //createDynamicQuestion
// export const createDynamicQuestion = async (data, token) => {
//   const apiUrl = "/api/companyAdmin/createDynamicQuestion";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const createCompanyGamification = async (data, token) => {
//   const apiUrl = "/api/createGamifications";

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const getCompanyQuestions = async (token, companyId) => {
//   const apiUrl = "/api/getCompanyQuestions";
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const getCompanyGamifications = async (token, companyId) => {
//   const apiUrl = "/api/getGamifications";
//   const data = {
//     companyId: companyId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const CreateThread = async (data) => {
//   const apiUrl = "/pub/createComment";

//   try {
//     const res = await fetch(baseURL + apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (res.ok) {
//       const data = await res.json();
//       return {
//         error: false,
//         status: 200,
//         data: data,
//       };
//     } else {
//       const data = await res.json();
//       return {
//         error: true,
//         status: 200,
//         data: data,
//       };
//     }
//   } catch (error) {
//     return {
//       error: true,
//       status: 400,
//       data: error,
//     };
//   }
// };

// export const getSellingItems = async (category = '') => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = category ? 
//     `/api/getSellingItems/${currentUser.company.id}?category=${category}` :
//     `/api/getSellingItems/${currentUser.company.id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   return res.json();
// };

// export const GetCompaniesAllThread = async () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/pub/getAllThreadMessage/${currentUser.company.id}`;


//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },

//   });
//   return res.json();
// };

// export const deleteQuestion = async (questionId) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = "/api/deleteCompanyQuestion";

//   const requestData = {
//     questionId: questionId,
//   };
//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
// };

// export const getConversations = async () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/getConversations/${currentUser.user.id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   return res.json();
// };

// export const getConversationMessages = async (id) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/getConversationMessages?conversationId=${id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   return res.json();
// };

// export const postMessage = async (data) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/postMessage`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const createConversation = async (data) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/createConversation`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// export const addQuestionCategory = async (name) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/addQuestionCategory`;
//   const data = { name: name, companyId: currentUser.company.id }

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //create questionnaire with title and description and isReady
// export const createQuestionnaire = async (title, description, isReady) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/companyAdmin/createQuestionnaire`;
//   const data = { 
//     questionnaireTitle: title, 
//     questionnaireDescription: description, 
//     isReady: Boolean(isReady), 
//     companyId: currentUser.company.id,
//     isLive: false,
//   };

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     throw new Error('Failed to add questionnaire');
//   }
//   return res.json();
// };


// export const getQuestionCategories = async () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/getQuestionCategories/${currentUser.company.id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   return res.json();
// };

// //getQuestionnaire 
// export const getQuestionnaire = async () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/companyAdmin/getQuestionnaire/${currentUser.company.id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   console.log("res getQuestionnaire", res);
//   return res.json();
// };

// //getUserQuestionnaire
// export const getUserQuestionnaire = async () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/getUserQuestionnaire/${currentUser.company.id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   console.log("res getQuestionnaire", res);
//   return res.json();
// };

// //getUserAttemptedQuestionnaire
// export const getUserAttemptedQuestionnaire = async () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/getUserAttemptedQuestionnaire/${currentUser.company.id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   console.log("res getQuestionnaire", res);
//   return res.json();
// };
// //getUserAttemptedQuestionnaireToAdmin
// // export const getUserAttemptedQuestionnaireToAdmin = async (questionnaireId, companyId) => {
// //   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// //   console.log("getUserAttemptedQuestionnaireToAdmin->", questionnaireId, companyId);
// //   const apiUrl = `/api/companyAdmin/getUserAttemptedQuestionnaireToAdmin`;
// //   const data = {questionnaireId: questionnaireId, companyId: companyId }
// //   const res = await fetch(baseURL + apiUrl, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //       "x-token": `${currentUser.token}`,
// //     },
// //     body:JSON.stringify(data),
// //   });
// //   return res.json();
// // };
// export const getUserAttemptedQuestionnaireToAdmin = async (questionnaireId, companyId) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   console.log("getUserAttemptedQuestionnaireToAdmin->", questionnaireId, companyId);

//   // Construct the query string
//   const queryParams = new URLSearchParams({ questionnaireId, companyId }).toString();
//   const apiUrl = `/api/companyAdmin/getUserAttemptedQuestionnaireToAdmin?${queryParams}`;

//   // Fetch data using GET method without a body
//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   return res.json();
// };


// //fetchDynamicQuestions
// export const getDynamicQuestions = async (questionnaireId, companyId) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/companyAdmin/getDynamicQuestions/${questionnaireId}?companyId=${companyId}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   console.log("res getDynamicQuestions", res);
//   return res.json();
// };
// //getUserDynamicQuestions
// export const getUserDynamicQuestions = async (questionnaireId, companyId) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/getUserDynamicQuestions/${questionnaireId}?companyId=${companyId}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });
//   console.log("res getUserDynamicQuestions", res);
//   return res.json();
// };

// export const deleteQuestionCategory = async (id) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/deleteQuestionCategory/${id}`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//   });

//   res.status === 204 ? window.location.reload() : toast.error('Error while deleting')
// };


// export const updateQuestionCategory = async (categoryId, name) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/updateCategoryName`;
//   const data = { newName: name, categoryId: categoryId }

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };
// //update the toggle isReady
// export const updateQuestionnaireIsReady = async (questionnaireId, isReady) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/companyAdmin/updateQuestionnaireIsReady`;
//   const data = { isReady: isReady, questionnaireId: questionnaireId }

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //updateQuestionnaireIsLive
// export const updateQuestionnaireIsLive = async (questionnaireId, isLive) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/companyAdmin/updateQuestionnaireIsLive`;
//   const data = { isLive: isLive, questionnaireId: questionnaireId }

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //update the questionnaire title and description
// export const handleUpdateQuestionnaireTitleAndDescription = async (questionnaireId, questionnaireTitle, questionnaireDescription) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/companyAdmin/handleUpdateQuestionnaireTitleAndDescription`;
//   const data = { questionnaireTitle: questionnaireTitle, questionnaireDescription:questionnaireDescription, questionnaireId: questionnaireId }
//   console.log("handleUpdateQuestionnaireTitleAndDescription", data);
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };


// export const getArticles = async (category) => {
//   const apiKey = "AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw";
//   const cx = "430d5a3e4f6f644f4";
//   // const url = `https://customsearch.googleapis.com/customsearch/v1?cx=430d5a3e4f6f644f4&q=${category}%20c[%E2%80%A6]yPrint=true&key=AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw`
//   const url = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${category}&key=${apiKey}`;

//   try {
//       const res = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return res.json();
//   } catch {
//     toast.error('Error!')
//   }
// };

// // export const getArticlesFromTopicAndContentPref = async ({ topic, contentPreferences }) => {
// //   const apiKey = "AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw";
// //   const cx = "430d5a3e4f6f644f4";

// //   if (!topic || !Array.isArray(contentPreferences) || contentPreferences.length === 0) {
// //     console.error('Invalid parameters:', { topic, contentPreferences });
// //     toast.error('Invalid parameters for fetching articles');
// //     return null;
// //   }

// //   // Combine the topic and content preferences into a single search query
// //   const searchParams = `${topic} ${contentPreferences.join(' ')}`;
// //   const url = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${encodeURIComponent(searchParams)}&key=${apiKey}`;

// //   try {
// //     const res = await fetch(url, {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });
// //     if (!res.ok) {
// //       throw new Error('Network response was not ok');
// //     }
// //     return await res.json();
// //   } catch (error) {
// //     toast.error('Error while fetching articles');
// //     console.error('Error fetching articles:', error);
// //   }
// // };

// export const getArticlesFromTopicAndContentPref = async ({ topic, contentPreferences, start = 1 }) => {
//   //new api key=AIzaSyDS-x8lZ0vl_suQ11XB2ndkFiQTT-SlxR0
//   //old api key=AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw
//   //new cx=06a74ca2383b64e43
//   //old cx=430d5a3e4f6f644f4
//   const apiKey = "AIzaSyDS-x8lZ0vl_suQ11XB2ndkFiQTT-SlxR0";
//   const cx = "06a74ca2383b64e43";
//   const numResults = 10;
//   const searchParams = `${topic} ${contentPreferences.join(' ')}`;
//   const url = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${encodeURIComponent(searchParams)}&key=${apiKey}&num=${numResults}&start=${start}`;

//   const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
//     try {
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) {
//         if (res.status === 429 && retries > 0) {
//           console.warn(`Rate limited. Retrying after ${delay} ms...`);
//           await new Promise((resolve) => setTimeout(resolve, delay));
//           return fetchWithRetry(url, retries - 1, delay * 2);
//         }
//         throw new Error('Network response was not ok');
//       }
//       return await res.json();
//     } catch (error) {
//       toast.error('Error while fetching articles');
//       console.error('Error fetching articles:', error);
//       throw error;
//     }
//   };

//   return fetchWithRetry(url);
// };



// export const forgotPassword = async (requestData) => {
//   const apiUrl = `/pub/forgotPassword`;

//   try {
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
//   } catch {
//     toast.error('Error!')
//   }


// };

// export const verifyOTP = async (requestData) => {
//   const apiUrl = `/pub/verifyOTP`;

//   try {
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
//   } catch {
//     toast.error('Error!')
//   }

// };

// export const resetPassword = async (requestData) => {
//   const apiUrl = `/pub/resetPassword`;

//   try {
//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestData),
//   });
//   return res.json();
//   } catch {
//     toast.error('Error!')
//   }

// };

// export const UpdateUser = async (data) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/updateUserProfile`;

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// //
// export const UpdateUserFromStartUpQuestions = async (data) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const apiUrl = `/api/UpdateUserFromStartUpQuestions`;
//   console.log("Persona data in front controller", data);

//   const res = await fetch(baseURL + apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };

// api.js

import { ContactlessOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { baseURL } from "src/utils/baseURL";
import { GraphQLClient, gql } from 'graphql-request';


export const Login = async (email, password) => {
  const apiUrl = "/pub/login";

  const requestData = {
    email: email,
    password: password,
  };
  console.log("requestData", requestData);
  try {
    const res = await fetch(baseURL + apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        error: false,
        status: 200,
        data: data,
      };
    } else {
      const data = await res.json();
      return {
        error: true,
        status: 200,
        data: data,
      };
    }
  } catch (error) {
    return {
      error: true,
      status: 400,
      data: error,
    };
  }
};

export const sendEmail = async (data) => {
  const apiUrl = "/pub/sendEmail";

  try {
    const res = await fetch(baseURL + apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resp = await res.json();
  } catch (error) {
    return {
      error: true,
      status: 400,
      data: error,
    };
  }
};

export const handleDeleteCompany = async (questionId, token) => {
  const apiUrl = "/api/admin/deleteCompany";
  const requestData = {
    questionId: questionId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
};

//delete question based on company id
export const deleteDynamicQuestion = async (questionId, companyId, token) => {
  const apiUrl = "/api/companyAdmin/deleteDynamicQuestion";
  const requestData = {
    questionId: questionId,
    companyId: companyId, // Include company ID
  };
  console.log("requestData", token);
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(requestData),
  });
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage);
  }
  return res.json();
};


export const UpdateCompany = async (data, token) => {
  const apiUrl = "/api/admin/updateCompany";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const GetAllCompanies = async (token) => {
  const apiUrl = "/api/admin/allCompanies";

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
  });
  return res.json();
};

export const inviteBulkUsers = async (token, usersData) => {
  const apiUrl = "/api/inviteUsersCSV";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = { users: usersData, companyId: currentUser.company.id };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const GetAllCompaniesForCompanyAdmin = async (token) => {
  const apiUrl = "/api/companyAdmin/GetAllCompaniesForCompanyAdmin";
  console.log("token", token);

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
  });
  return res.json();
};

// create company policy
export const createCompanyPolicy = async (data, token) => {
  const apiUrl = "/api/companyAdmin/createCompanyPolicy";
  console.log("policy data", data);
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// create company announcement
export const createCompanyAnnouncement = async (data, token) => {
  const apiUrl = "/api/companyAdmin/createCompanyAnnouncement";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//createUserAttemptQuestionnaire
export const createUserAttemptQuestionnaire = async (companyId, userId, questionnaireId, token, questionnareData) => {
  const apiUrl = "/api/createUserAttemptQuestionnaire";
  const data = {
    companyId: companyId,
    userId: userId,
    questionnaireId: questionnaireId,
    questionnareData: questionnareData,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAllCompanyPolicies = async (token, companyId) => {
  const apiUrl = "/api/companyAdmin/allCompanyPolicy";
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const UpdatePolicy = async (data, token) => {
  const apiUrl = "/api/companyAdmin/updateCompanyPolicy";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const handleDeleteCompanyPolicy = async (companyId, token) => {
  const apiUrl = "/api/companyAdmin/deleteCompanyPolicy";

  const requestData = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
};

//announcements


export const toggleVisibility = async (token, announcementId) => {
  const apiUrl = "/api/companyAdmin/toggleVisibility";
  const data = {
    id: announcementId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getAllCompanyAnnouncements = async (token, companyId) => {
  const apiUrl = "/api/companyAdmin/allCompanyAnnouncement";
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getProjectsByDepartmentId = async (token,departmentid) => {
  const apiUrl = "/api/getProjectsByDepartmentId";

  const data = {
 
   
    departmentid:departmentid
  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


export const CreateProject = async (token,name,description,departmentid,startDate,endDate,projectLead,projectAdministrator,projectTeam) => {
  const apiUrl = "/api/create-project";

  const data = {
 
    name:name,
    description:description,
   
    departmentid:departmentid,
 
    startDate:startDate,
    endDate:endDate,
    projectLead:projectLead,
    projectAdministrator:projectAdministrator,
    projectTeam:projectTeam
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const UpdateAnnouncement = async (data, token) => {
  const apiUrl = "/api/companyAdmin/updateCompanyAnnouncement";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const handleDeleteCompanyAnnouncement = async (companyId, token) => {
  const apiUrl = "/api/companyAdmin/deleteCompanyAnnouncement";

  const requestData = {
    id: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
};

//
export const getAllCompanyUser = async (token, companyId, superAdmin) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let apiUrl = `/api/${superAdmin ? 'admin' : 'companyAdmin'}/getAllUserByCompanyId`;
  if(currentUser.user.role==='user')
    {
       apiUrl = `/api/getAllUserByCompanyId`;
    }

  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//get all user daily question
export const getAllDailyQuestions = async (token, companyId) => {
  const apiUrl = "/api/companyAdmin/getAllDailyQuestionsByCompanyId";
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  console.log("api/index file", res);
  return res.json();
};

export const getUserStartUpQuestions = async (token, companyId, userId) => {
  const apiUrl = "/api/getAllStartUpQuestionsByCompanyIdAndUserId";
  const data = {
    companyId: companyId,
    userId: userId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  console.log("api/index file", res);
  return res.json();
};

export const getCompanyData = async (token, companyId) => {
  const apiUrl = `/api/admin/company`;
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const getAllAdmins = async (token) => {
  const apiUrl = "/api/companyAdmin/getAllAdmins";
  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
  });
  return res.json();
};

export const UpdateCompanyUser = async (data, token, superAdmin) => {
  console.log("UpdateCompanyUser", data);
  console.log("role:", superAdmin);
  const apiUrl = `/api/${superAdmin ? 'admin' : 'companyAdmin'}/updateUser`;
  console.log("apiUrl", apiUrl);
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const updateUserQuestionnaire = async (data, token) => {
  const apiUrl = "/api/updateUserQuestionnaire";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//updateStartUpQuestions
export const updateStartUpQuestions = async (data, token) => {
  const apiUrl = "/api/updateStartUpQuestions";
  console.log("updated startup data", data);

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// department management
export const createDepartment = async (data, token) => {
  const apiUrl = "/api/createDepartment";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//create questions on daily basis
export const createDailyQuestions = async (data, token) => {
  const apiUrl = "/api/createDailyQuestions";
  console.log("token:", token);
  // const data1 = {
  //   anxietyLevel:data.anxietyLevel,
  //   feeling: data.feeling,
  //   reason: data.reason,
  //   symptom: data.symptom
  // };
  try {
    const res = await fetch(baseURL + apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": `${token}`,
      },
      body: JSON.stringify(data),
    });
    console.log("res", res);
    // if (!res.ok) {
    //   throw new Error(`HTTP error! status: ${res.status}`);
    // }

    return res.json();
  } catch (error) {
    console.error("Error in API call:", error); // Debugging line
    throw error;
  }
};

//create startup questions
export const createStartUpQuestions = async (data, token) => {
  const apiUrl = "/api/createStartUpQuestions";

  console.log("Data being sent to API:", data);

  const convertedData = {
    userId: data.userId,
    companyId: data.companyId,
    authorName: data.authorName,
    bookTitle: data.bookTitle,
    contentPreferences: data.contentPreferences,
    engagementMethod: data.engagementMethod,
    hobbies: data.hobbies,
    interestTopics: data.interestTopics,
    lifePrincipleInspirations: data.lifePrincipleInspirations,
    personalityType: data.personalityType,
    readingPreference: data.readingPreference,
    relaxationActivities: data.relaxationActivities,
  };

  try {
    const res = await fetch(baseURL + apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": `${token}`,
      },
      body: JSON.stringify(convertedData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};

export const getDepartmentTeamsbyLead = async (token, leadId) => {
  const apiUrl = "/api/getDepartmentTeamsbyLead";
  const data = {
    leadId: leadId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
export const getDepartmentsyuserid = async (token, headId) => {
  const apiUrl = "/api/getDepartmentsyuserid";
  const data = {
    headId: headId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
export const getFunctionDepartments = async (token, functionId) => {
  const apiUrl = "/api/getFunctionDepartments";
  const data = {
    functionId: functionId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const deleteDepartment = async (departmentId, token) => {
  const apiUrl = "/api/deleteDepartment";

  const requestData = {
    id: departmentId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
}

export const updateDepartment = async (data, token) => {
  const apiUrl = "/api/updateDepartment";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// function management
export const createFunction = async (data, token) => {
  const apiUrl = "/api/createFunction";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCompanyFunctionsbyuserid = async (token, userid) => {
  const apiUrl = "/api/getCompanyFunctionsbyuserid";
  const data = {
    userid: userid,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const getCompanyFunctions = async (token, companyId) => {
  const apiUrl = "/api/getCompanyFunctions";
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const deleteFunction = async (functionId, token) => {
  const apiUrl = "/api/deleteFunction";

  const requestData = {
    id: functionId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
}

export const updateFunction = async (data, token) => {
  console.log("updateFunction data", data);
  const apiUrl = "/api/updateFunction";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const createTeam = async (data, token) => {
  const apiUrl = "/api/createTeam";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const getDepartmentTeams = async (token, departmentId) => {
  const apiUrl = "/api/getDepartmentTeams";
  const data = {
    departmentId: departmentId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const updateTeam = async (data, token) => {
  console.log("updateTeam", data);
  const apiUrl = "/api/updateTeam";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const deleteTeam = async (teamId, token) => {
  const apiUrl = "/api/deleteTeam";

  const requestData = {
    id: teamId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
}

export const getTeamMembers = async (token, teamId) => {
  const apiUrl = "/api/getTeamMembers";
  const data = {
    teamId: teamId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const handleDeleteCompanyUser = async (userId, token) => {
  const apiUrl = "/api/companyAdmin/deleteUserById";

  const requestData = {
    id: userId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
};

export const getUserCompanyPolicy = async (token, companyId) => {
  const apiUrl = "/api/getCompanyPolicy";
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCompanyAnnouncement = async (token, companyId,userId,) => {
  const apiUrl = "/api/getCompanyAnnouncementforuser";
  const data = {
    companyId: companyId,
    userId:userId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};




export const getAnnouncementStats = async ( announcementId, token) => {
  const apiUrl = "/api/getAnnouncementStats";
  const data = {
   
    announcementId: announcementId,
  
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getResponsesByUserId = async ( userId, token) => {
  const apiUrl = "/api/getResponsesByUserId";
  const data = {
   
    userId: userId,
  
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const saveAnswers = async (answers, userId, token) => {
  const apiUrl = "/api/saveAnswers";
  const data = {
    answers: answers,
    userId: userId,
  
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateUserPointsPolicy = async (point, userId, policyId, token) => {
  const apiUrl = "/api/updateUserPoints";
  const data = {
    userPolicyId: policyId,
    userRewards: point,
    userId: userId,
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateUserPoints = async (point, userId, policyId, token) => {
  const apiUrl = "/api/updateUserPointsAnnouncement";
  const data = {
    userPolicyId: policyId,
    userRewards: point,
    userId: userId,
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getUserProfile = async (userId, token) => {
  const apiUrl = "/api/getUserProfile";
  const data = {
    userId: userId,
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//getUserByCompany
export const getUserByCompany = async (userId, token) => {
  const apiUrl = "/api/companyAdmin/getUserProfile";
  const data = {
    userId: userId,
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createCompanyQuestion = async (data, token) => {
  const apiUrl = "/api/createQuestions";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//createDynamicQuestion
export const createDynamicQuestion = async (data, token) => {
  const apiUrl = "/api/companyAdmin/createDynamicQuestion";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCompanyQuestions = async (token, companyId) => {
  const apiUrl = "/api/getCompanyQuestions";
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const CreateThread = async (data) => {
  const apiUrl = "/pub/createComment";

  try {
    const res = await fetch(baseURL + apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        error: false,
        status: 200,
        data: data,
      };
    } else {
      const data = await res.json();
      return {
        error: true,
        status: 200,
        data: data,
      };
    }
  } catch (error) {
    return {
      error: true,
      status: 400,
      data: error,
    };
  }
};

export const getSellingItems = async (category = '') => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = category ? 
    `/api/getSellingItems/${currentUser.company.id}?category=${category}` :
    `/api/getSellingItems/${currentUser.company.id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  return res.json();
};

export const GetCompaniesAllThread = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/pub/getAllThreadMessage/${currentUser.company.id}`;


  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },

  });
  return res.json();
};
export const toggleLike = async (threadId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/pub/threads/${threadId}/like`;
  const data ={
    id:currentUser.user.id
  }
  const response = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": currentUser.token,
      
    },
    body: JSON.stringify(data),
  });

 

  return response.json();
};

export const toggleDislike = async (threadId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/pub/threads/${threadId}/dislike`;
  const data ={
    id:currentUser.user.id
  }
  const response = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": currentUser.token,
    },
    body: JSON.stringify(data),
  });

 
  return response.json();
};
export const markAllThreadsAsViewed = async () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/pub/threads/update-view`;
  const data ={
    userId:currentUser.user.id,
    companyId:currentUser.company.id
  }
  const response = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": currentUser.token,
    },
    body: JSON.stringify(data),
  });

 
  return response.json();


};
export const getUnviewedThreadsCount = async (userId, companyId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = '/pub/threads/unviewed-count';
  const data ={
    userId:currentUser.user.id,
    companyId:currentUser.company.id
  }
  const response = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": currentUser.token,
    },
    body: JSON.stringify(data),
  });

 
  return response.json();
 
};
export const deleteQuestion = async (questionId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = "/api/deleteCompanyQuestion";

  const requestData = {
    questionId: questionId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
};

export const getConversations = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/conversations/${currentUser.user.id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  return res.json();
};

export const getConversationMessages = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/messages/${id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  return res.json();
};

export const getChatRequests = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/invitations/user/${currentUser.user.id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  return res.json();
};
export const readmessage = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/messages/read/${currentUser.user.id}`;
  const requestData = {
    chatid: id,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
};
export const rejectChatRequest = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/invitations/${id}`;
  const requestData = {
    status: "rejected",
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
body:JSON.stringify(requestData),
  });
  return res.json();
};
export const acceptChatRequest = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/invitations/${id}`;
  const requestData = {
    status: "accepted",
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
body:JSON.stringify(requestData),
  });
  return res.json();
};
export const removememberfromgroup = async (userids,id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/conversations/removeUser/${id}`;
  const requestData = {
    userId: userids,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
body:JSON.stringify(requestData),
  });
  return res.json();
};
export const BlockUser = async (userids) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/BlockUser`;
  const requestData = {
    blockerId:currentUser.user.id,
    blockedIds: userids,
  };
  console.log("BLOCKING USER ID PASSED : ",requestData);
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
body:JSON.stringify(requestData),
  });
  return res.json();
};

export const UnBlockUser = async (userids) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/unblockUser`;
  const requestData = {
    blockerId:currentUser.user.id,
    blockedIds: userids,
  };
  console.log("BLOCKING USER ID PASSED : ",requestData);
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
body:JSON.stringify(requestData),
  });
  return res.json();
};
export const getblockuser = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getblockuser/${currentUser.user.id}`;

  
  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },

  });
  return res.json();
};

export const getBlockedByUsers = async (currentUserId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/blockedByUsers/${currentUser.user.id}`;

  
  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },

  });
  return res.json();
};

export const addmembertogroup = async (userids,id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/conversations/addUser/${id}`;
  const requestData = {
    userId: userids,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
body:JSON.stringify(requestData),
  });
  return res.json();
};


export const updateMessageStatus = async (chatId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/updateMessageStatus`;
  const data = {
    chatId: chatId,
    userid:currentUser.user.id
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const postMessage = async (data) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/messages`;

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createConversation = async (data,token) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/conversations`;
  
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const addQuestionCategory = async (name,description,images,video,subCategoryId,selectedgameid,startingLevel,canProceedToNextLevel) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/addQuestionCategory`;
  const data = { name: name, companyId: currentUser.company.id,  images: images,
    description:description,
    video:video,
    subCategoryId:subCategoryId,
    gameid:selectedgameid,starting:startingLevel,canProceedToNextLevel:canProceedToNextLevel }

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//create questionnaire with title and description and isReady
export const createQuestionnaire = async (title, description, isReady) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/createQuestionnaire`;
  const data = { 
    questionnaireTitle: title, 
    questionnaireDescription: description, 
    isReady: Boolean(isReady), 
    companyId: currentUser.company.id,
    isLive: false,
  };

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to add questionnaire');
  }
  return res.json();
};


export const getQuestionCategories = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getQuestionCategories/${currentUser.company.id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  console.log("res getGamification", res);
  return res.json();
};

//getQuestionnaire 
export const getQuestionnaire = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/getQuestionnaire/${currentUser.company.id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  console.log("res getQuestionnaire", res);
  return res.json();
};

//getUserQuestionnaire
export const getUserQuestionnaire = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getUserQuestionnaire/${currentUser.company.id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  console.log("res getQuestionnaire", res);
  return res.json();
};

//getUserAttemptedQuestionnaire
export const getUserAttemptedQuestionnaire = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getUserAttemptedQuestionnaire/${currentUser.company.id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  console.log("res getQuestionnaire", res);
  return res.json();
};
//getUserAttemptedQuestionnaireToAdmin
// export const getUserAttemptedQuestionnaireToAdmin = async (questionnaireId, companyId) => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   console.log("getUserAttemptedQuestionnaireToAdmin->", questionnaireId, companyId);
//   const apiUrl = `/api/companyAdmin/getUserAttemptedQuestionnaireToAdmin`;
//   const data = {questionnaireId: questionnaireId, companyId: companyId }
//   const res = await fetch(baseURL + apiUrl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-token": `${currentUser.token}`,
//     },
//     body:JSON.stringify(data),
//   });
//   return res.json();
// };
export const getUserAttemptedQuestionnaireToAdmin = async (questionnaireId, companyId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("getUserAttemptedQuestionnaireToAdmin->", questionnaireId, companyId);

  // Construct the query string
  const queryParams = new URLSearchParams({ questionnaireId, companyId }).toString();
  const apiUrl = `/api/companyAdmin/getUserAttemptedQuestionnaireToAdmin?${queryParams}`;

  // Fetch data using GET method without a body
  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  return res.json();
};


//fetchDynamicQuestions
export const getDynamicQuestions = async (questionnaireId, companyId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/getDynamicQuestions/${questionnaireId}?companyId=${companyId}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  console.log("res getDynamicQuestions", res);
  return res.json();
};
//getUserDynamicQuestions
export const getUserDynamicQuestions = async (questionnaireId, companyId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getUserDynamicQuestions/${questionnaireId}?companyId=${companyId}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  console.log("res getUserDynamicQuestions", res);
  return res.json();
};

export const deleteQuestionCategory = async (id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/deleteQuestionCategory/${id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });

  res.status === 204 ? window.location.reload() : toast.error('Error while deleting')
};


export const updateQuestionCategory = async (categoryId, name) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/updateCategoryName`;
  const data = { newName: name, categoryId: categoryId }

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
//update the toggle isReady
export const updateQuestionnaireIsReady = async (questionnaireId, isReady) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/updateQuestionnaireIsReady`;
  const data = { isReady: isReady, questionnaireId: questionnaireId }

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//updateQuestionnaireIsLive
export const updateQuestionnaireIsLive = async (questionnaireId, isLive) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/updateQuestionnaireIsLive`;
  const data = { isLive: isLive, questionnaireId: questionnaireId }

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//update the questionnaire title and description
export const handleUpdateQuestionnaireTitleAndDescription = async (questionnaireId, questionnaireTitle, questionnaireDescription) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/handleUpdateQuestionnaireTitleAndDescription`;
  const data = { questionnaireTitle: questionnaireTitle, questionnaireDescription:questionnaireDescription, questionnaireId: questionnaireId }
  console.log("handleUpdateQuestionnaireTitleAndDescription", data);
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


export const getArticles = async (category) => {
  const apiKey = "AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw";
  const cx = "430d5a3e4f6f644f4";
  // const url = `https://customsearch.googleapis.com/customsearch/v1?cx=430d5a3e4f6f644f4&q=${category}%20c[%E2%80%A6]yPrint=true&key=AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw`
  const url = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${category}&key=${apiKey}`;

  try {
      const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
  } catch {
    toast.error('Error!')
  }
};

// export const getArticlesFromTopicAndContentPref = async ({ topic, contentPreferences }) => {
//   const apiKey = "AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw";
//   const cx = "430d5a3e4f6f644f4";

//   if (!topic || !Array.isArray(contentPreferences) || contentPreferences.length === 0) {
//     console.error('Invalid parameters:', { topic, contentPreferences });
//     toast.error('Invalid parameters for fetching articles');
//     return null;
//   }

//   // Combine the topic and content preferences into a single search query
//   const searchParams = `${topic} ${contentPreferences.join(' ')}`;
//   const url = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${encodeURIComponent(searchParams)}&key=${apiKey}`;

//   try {
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!res.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return await res.json();
//   } catch (error) {
//     toast.error('Error while fetching articles');
//     console.error('Error fetching articles:', error);
//   }
// };

export const getpodcastUrlsByTitle = async (title) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getpodcastUrlsByTitle`;
  const data = { titles: title }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getBooksUrlsByTitle = async (title) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getBooksUrlsByTitle`;
  const data = { titles: title }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getWebinarsUrlsByTitle = async (title) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getWebinarsUrlsByTitle`;
  const data = { titles: title }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getVideosByTitle = async (title) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getVideoUrlsByTitle`;
  const data = { titles: title }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getUrlsByTitle = async (title) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/getUrlsByTitle`;
  const data = { titles: title }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createwebinars = async (title, urls) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/createwebinars`;
  const data = { title: title, urls:urls }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const createBooks = async (title, urls) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/createBooks`;
  const data = { title: title, urls:urls }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const createPosdcast = async (title, urls) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/createPosdcast`;
  const data = { title: title, urls:urls }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const createVideos = async (title, urls) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/createVideos`;
  const data = { title: title, urls:urls }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const createArticle = async (title, urls) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/createArticle`;
  const data = { title: title, urls:urls }
 
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getArticlesFromTopicAndContentPref = async ({ topic, contentPreferences, hobbies, start = 1 }) => {
  //new api key=AIzaSyDS-x8lZ0vl_suQ11XB2ndkFiQTT-SlxR0
  //old api key=AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw
  //new cx=06a74ca2383b64e43
  //old cx=430d5a3e4f6f644f4
  //console.log("hobbiesData in index.js file", hobbies);
  console.log("topic for getArticlesFromTopicAndContentPref", topic);
  // console.log("contentPreferences", contentPreferences);
  const apiKey = "AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw";
  const cx = "430d5a3e4f6f644f4";
  const numResults = 10;
  // const searchParams = `${topic} ${contentPreferences.join(' ')}`;
  const searchParams = `${topic}`;
  const url = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${encodeURIComponent(searchParams)}&key=${apiKey}&num=${numResults}&start=${start}`;

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 429 && retries > 0) {
          console.warn(`Rate limited. Retrying after ${delay} ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(url, retries - 1, delay * 2);
        }
        throw new Error('Network response was not ok');
      }
      return await res.json();
    } catch (error) {
      toast.error('Error while fetching articles');
      console.error('Error fetching articles:', error);
      throw error;
    }
  };

  return fetchWithRetry(url);
};
//////////////////////////////
export const getresultsArticlesForInterestTopics = async ({ topic, start = 1 }) => {
  const apiKey = "AIzaSyC3FVIBTpZUcwYI16HR1K9eu8TktccL6Dw";
  const cx = "430d5a3e4f6f644f4";
  const numResults = 10;
  // const searchParams = `${topic} ${contentPreferences.join(' ')}`;
  const searchParams = `${topic}`;
  const url = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${encodeURIComponent(searchParams)}&key=${apiKey}&num=${numResults}&start=${start}`;

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 429 && retries > 0) {
          console.warn(`Rate limited. Retrying after ${delay} ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(url, retries - 1, delay * 2);
        }
        throw new Error('Network response was not ok');
      }
      return await res.json();
    } catch (error) {
      toast.error('Error while fetching articles');
      console.error('Error fetching articles:', error);
      throw error;
    }
  };

  return fetchWithRetry(url);
};


// export const getArticlesFromTopicAndContentPref = async ({ topic, contentPreferences, start = 1 }) => {
//   const apiKey = "AIzaSyDS-x8lZ0vl_suQ11XB2ndkFiQTT-SlxR0";
//   const cx = "06a74ca2383b64e43";
//   const apiKeyForBooksAndVideos = "AIzaSyASbJoq3CnhUFeVo--9KNM-l0C12m-oyAc";
//   //for dev
//   const apiKeyForPoscast = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDdhNGEzYS1iNDQwLTQ4M2YtYjI4Mi02OGU1NjRjNTA1ZWMiLCJqdGkiOiIwMjA5NjQ5NjQzYmQ2ZDk5MTlhYmQyZTZiYTI4OWZlOGY4NjM3YjAwNDZjYTExNmUzMjMzMzU5NzE5ZmY5ZDNiMWM0NjBlMGIxZTkxZDc5MiIsImlhdCI6MTczMTQ4NTU3Mi41OTY4MDMsIm5iZiI6MTczMTQ4NTU3Mi41OTY4MDUsImV4cCI6MTc2MzAyMTU3Mi41ODY0NjQsInN1YiI6IiIsInNjb3BlcyI6WyIqIl19.nRQ17Mv59d2L1izf7__XyahO9JgiQ62GAJ3sai8N9b4QrdXpPZVb4hxcpZwdYYuVm4jwGAueGb0Av_O2FWskQjRsZtqbEtWbAkXI93qj5UD3dz3Hj9wXnp2X3mL3Se1D6m08ZfCR88yDyac8yWJhDczY8hjzmC3APvOR6EOopO1JBZzJ9n0Lg4_J13kd2PNj7B_kkTrIX3YRLAPC1xymMDS4oeDdcDRlwNQ2WP9UumlWQPiXJsVkYOcpcULiXanOMnP7cd9qyyAL4XqbHK6TsIvA1aSEmPJ_h2TSM86sxz4dN5YpIve0W_qMHJ9AY0F1sL0Wvx_SrHk0Mv5gmMtwUDiea3T5DjPVn_OrmHkmOB73TPmSO0DqhH22UK8jyPnnhj0G3tKYzAlaxrhHoxEHPM1Eew-upHYovc35H3uo-dFk5YMAqgQGf83liIGpCAL8BByMWJnJWrRyjIz8g4m_c1qKw_r7fmADib9S5U-0WC0L0ZGqAw5CL1fNx8xZUMaQJTXU0R_jkFBUPH5y9xXi0XEOMlb62zEqVbHc7nxrhjqiXvC9xn8yj2IFxLtL7cfLvRswWJevEbX2909Qlen2wOE7OuIBfp8TuCKljNXJJjTnBJ-ievplB2HK1rVAEBS4OYNSMNP12FdPuxeq75GkDd-IxbRbjRD-rgaUrKRM1i8"
//   const apiKeyForWebiners = "O7NVRVWPDXHN4QGO6IUU";
//   const numResults = 10;
//   //for prod
//   //const apiKeyForPoscast = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDdhNGEzYS05NjgwLTQ4ZTEtODYzMy01ZTk0MWVmYjg5MWUiLCJqdGkiOiI1Zjk5MTQ2Y2ZiMzM1NTM3MzM4ZGJkMGY0Zjc4MzdlODNlZTgxZjY2NDJjNjU5YmMzYzFlMWM1NWI0MTNlNGFlZWJkNzg1MTFlOWIxM2Q4ZSIsImlhdCI6MTczMTQ4NTU3Mi4wNjA4LCJuYmYiOjE3MzE0ODU1NzIuMDYwODAyLCJleHAiOjE3NjMwMjE1NzIuMDUwNDYyLCJzdWIiOiIiLCJzY29wZXMiOlsiKiJdfQ.dO7dyLNUFB4kDGRp96JWGsnOsa7a3F-CWHQs2brGh7GGUTah3LRs-qy3s3NUTHGghnZdMIEpYq8prEjUV7ZI5z3SxrVXLODuIMpwlhpzgOYDstOcjG3t7cV-cYf4yYZj8Vd8gD8IHazEQw9FCr_YaT8BsoqubVl1PkmZsm4izUUqs3XHirlXbvrCOtOZytCc034pBDLIkq73abvQbDvLUY-LolOUUixohBT7RrbpJVGJVBSw5xRG5c4I13uy6Cv9eWK-LJKEC9gCgQzfqffKh2EVZzrdNv0iI6Z4l83PxzNr39g6WO1nRKgjo2WMDjldgvEXV8YJJ3oiOiEjrQKMyphl9Ym49YyA61OxdN6UyRfVfP3eRwDBEPlNy8S6h0jMb6K3sacssqkeJ-ALW2PhELYSuBzTOS7ryv4UHlnVRw1fgTe80UyBmMbAerca-nj0trpgVHc5SWnPt-UZFbt0LL5sRcAwTru-w5ylEAeM7I5mosVKHBq1PL7xByVlQr7uAXdzQTUUtUevmPDUnIV3dIzNyvTm-2Xvk50reenDjHZV0r903NNcG-ak85hYmUjzfDUe3c1gxi_IanK6NUtq6ZgvMFUFOMOb_5736ziG-9ii-YU812XCEMMCfncHjpaCDvW4v8tn2NczmXn3PnFZm8sIShunTMsBUNkGsMqy-Wg"
//   // Define API URLs for different content types
//   const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(topic)}&key=${apiKeyForBooksAndVideos}&maxResults=${numResults}`;
//   const customSearchUrl = (query) =>
//     `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${encodeURIComponent(query)}&key=${apiKey}&num=${numResults}&start=${start}`;
//   const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&key=${apiKeyForBooksAndVideos}&type=video&maxResults=${numResults}`;
//   //const podcastSearchUrl = `https://api.podcast.com/search?q=${encodeURIComponent(topic)}&maxResults=${numResults}`; // Example Podcast API (replace with actual API)
//   const podcastSearchUrl = `https://api.podchaser.com/v1/search?q=${encodeURIComponent(topic)}&maxResults=${numResults}&apiKey=${apiKeyForPoscast}`;
//   const webinersSearchUrl = `https://www.eventbriteapi.com/v3/events/search/?q=${encodeURIComponent(query)}`;
//   // Helper function for fetch with retry
//   const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
//     try {
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) {
//         if (res.status === 429 && retries > 0) {
//           console.warn(`Rate limited. Retrying after ${delay} ms...`);
//           await new Promise((resolve) => setTimeout(resolve, delay));
//           return fetchWithRetry(url, retries - 1, delay * 2);
//         }
//         throw new Error('Network response was not ok');
//       }
//       return await res.json();
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       throw error;
//     }
//   };

//   // Aggregate results based on content preferences
//   let results = [];

//   // Fetch books if 'Reading Books' is selected
//   if (contentPreferences.includes('Reading Books')) {
//     try {
//       const booksResponse = await fetchWithRetry(googleBooksUrl);
//       const booksData = booksResponse.items?.map((item) => ({
//         title: item.volumeInfo.title,
//         link: item.volumeInfo.infoLink,
//         author: item.volumeInfo.authors?.join(', '),
//         type: 'Book',
//       }));
//       results = [...results, ...(booksData || [])];
//     } catch (error) {
//       console.error('Error fetching books:', error);
//     }
//   }

//   // Fetch articles if 'Reading Articles' is selected
//   if (contentPreferences.includes('Reading Articles')) {
//     try {
//       const articlesResponse = await fetchWithRetry(customSearchUrl(topic));
//       const articlesData = articlesResponse.items?.map((item) => ({
//         title: item.title,
//         link: item.link,
//         snippet: item.snippet,
//         type: 'Article',
//       }));
//       results = [...results, ...(articlesData || [])];
//     } catch (error) {
//       console.error('Error fetching articles:', error);
//     }
//   }

//   // Fetch videos if 'Watching video clips' is selected
//   if (contentPreferences.includes('Watching video clips')) {
//     try {
//       const videosResponse = await fetchWithRetry(youtubeSearchUrl);
//       const videosData = videosResponse.items?.map((item) => ({
//         title: item.snippet.title,
//         link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//         type: 'Video',
//       }));
//       results = [...results, ...(videosData || [])];
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//     }
//   }

//   // Fetch podcasts if 'Listening to Podcast' is selected
//   if (contentPreferences.includes('Listening to Podcast')) {
//     try {
//       const podcastsResponse = await fetchWithRetry(podcastSearchUrl);
//       const podcastsData = podcastsResponse.items?.map((item) => ({
//         title: item.title,
//         link: item.link,
//         type: 'Podcast',
//       }));
//       results = [...results, ...(podcastsData || [])];
//     } catch (error) {
//       console.error('Error fetching podcasts:', error);
//     }
//   }

//   // Fetch webinars if 'Webinars or conferences' is selected
//   if (contentPreferences.includes('Webinars or conferences')) {
//     try {
//       const webinarsResponse = await fetchWithRetry(customSearchUrl(`${topic} webinar OR conference`));
//       const webinarsData = webinarsResponse.items?.map((item) => ({
//         title: item.title,
//         link: item.link,
//         snippet: item.snippet,
//         type: 'Webinar',
//       }));
//       results = [...results, ...(webinarsData || [])];
//     } catch (error) {
//       console.error('Error fetching webinars:', error);
//     }
//   }

//   // Return aggregated results
//   return results;
// };

  const apiKey = "AIzaSyDS-x8lZ0vl_suQ11XB2ndkFiQTT-SlxR0";
  const cx = "06a74ca2383b64e43";
  const apiKeyForBooksAndVideos = "AIzaSyCveE0gcY-ZnusXV8D_gwkevF4NaI1u0tQ";
  //AIzaSyCveE0gcY-ZnusXV8D_gwkevF4NaI1u0tQ
  //AIzaSyASbJoq3CnhUFeVo--9KNM-l0C12m-oyAc
  //for dev
  const apiKeyForPoscast = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDdhNGEzYS1iNDQwLTQ4M2YtYjI4Mi02OGU1NjRjNTA1ZWMiLCJqdGkiOiIwMjA5NjQ5NjQzYmQ2ZDk5MTlhYmQyZTZiYTI4OWZlOGY4NjM3YjAwNDZjYTExNmUzMjMzMzU5NzE5ZmY5ZDNiMWM0NjBlMGIxZTkxZDc5MiIsImlhdCI6MTczMTQ4NTU3Mi41OTY4MDMsIm5iZiI6MTczMTQ4NTU3Mi41OTY4MDUsImV4cCI6MTc2MzAyMTU3Mi41ODY0NjQsInN1YiI6IiIsInNjb3BlcyI6WyIqIl19.nRQ17Mv59d2L1izf7__XyahO9JgiQ62GAJ3sai8N9b4QrdXpPZVb4hxcpZwdYYuVm4jwGAueGb0Av_O2FWskQjRsZtqbEtWbAkXI93qj5UD3dz3Hj9wXnp2X3mL3Se1D6m08ZfCR88yDyac8yWJhDczY8hjzmC3APvOR6EOopO1JBZzJ9n0Lg4_J13kd2PNj7B_kkTrIX3YRLAPC1xymMDS4oeDdcDRlwNQ2WP9UumlWQPiXJsVkYOcpcULiXanOMnP7cd9qyyAL4XqbHK6TsIvA1aSEmPJ_h2TSM86sxz4dN5YpIve0W_qMHJ9AY0F1sL0Wvx_SrHk0Mv5gmMtwUDiea3T5DjPVn_OrmHkmOB73TPmSO0DqhH22UK8jyPnnhj0G3tKYzAlaxrhHoxEHPM1Eew-upHYovc35H3uo-dFk5YMAqgQGf83liIGpCAL8BByMWJnJWrRyjIz8g4m_c1qKw_r7fmADib9S5U-0WC0L0ZGqAw5CL1fNx8xZUMaQJTXU0R_jkFBUPH5y9xXi0XEOMlb62zEqVbHc7nxrhjqiXvC9xn8yj2IFxLtL7cfLvRswWJevEbX2909Qlen2wOE7OuIBfp8TuCKljNXJJjTnBJ-ievplB2HK1rVAEBS4OYNSMNP12FdPuxeq75GkDd-IxbRbjRD-rgaUrKRM1i8"
  const apiKeyForWebinars = "O7NVRVWPDXHN4QGO6IUU";
  const numResults = 10;

// Helper function for fetch with retry
const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      if (res.status === 429 && retries > 0) {
        console.warn(`Rate limited. Retrying after ${delay} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1, delay * 2);
      }
      throw new Error('Network response was not ok');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Fetch Books
export const getBooks = async (topic) => {
  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(topic)}&key=${apiKeyForBooksAndVideos}&maxResults=40`;
  try {
    const response = await fetchWithRetry(googleBooksUrl);
    console.log("response books", response);
    return response.items?.map((item) => ({
      title: item.volumeInfo.title,
      link: item.volumeInfo.infoLink,
      author: item.volumeInfo.authors?.join(', '),
      image: item.volumeInfo.imageLinks?.thumbnail,
      type: 'Book',
    })) || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};
// Fetch Videos
export const getVideos = async (topic) => {
  const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&key=${apiKeyForBooksAndVideos}&type=video&maxResults=40`;
  try {
    const response = await fetchWithRetry(youtubeSearchUrl);
    console.log("video response", response);
    return response.items?.map((item) => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      image: item.snippet.thumbnails.default.url,
      type: 'Video',
    })) || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
// Fetch Podcasts

// export const getPodcasts = async (topic, numResults = 10) => {
//   console.log("topic for podcast", topic);
//   const graphqlUrl = "https://api.podchaser.com/graphql";
//   const BearerPodcastApi = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDdhNGEzYS1iNDQwLTQ4M2YtYjI4Mi02OGU1NjRjNTA1ZWMiLCJqdGkiOiJiZDNlMDU0OWMxY2Y4YWQ1MGYyYzc4Y2Y5M2RmMDRlODU2ODEwZDY3YzM2ODUzZGYzNTQyMzVmZDljMzU4MjViZWE1M2FkNmZjM2VjMTE0NiIsImlhdCI6MTczMTUwNjY2Ni44NTE4MjYsIm5iZiI6MTczMTUwNjY2Ni44NTE4MjgsImV4cCI6MTc2MzA0MjY2Ni44NDE1OTIsInN1YiI6IiIsInNjb3BlcyI6WyIqIl19.nic6eB0G1INAv7RlzF5EzrffedLNsWJa4e8wxUCirf4178Ob4EnsMX2OtGyVifskgUFOJ27AqkS6mcy0QKLHWKbV7LqIjvVeyHcY8_6bSB9OIWyKxiSVoqYYz4g1JwT1b63p-F4ztH3l7GgVBBiaXq5g3TpnnAfw2KQ50IcNnztveiHfI3IK0H9gk1e2IQG3OBFwg790u7-d4YD3B1Iv_mc-m1X7yB2B3tPV5w7DMJB4ztxPBaFLSLElgnUbrkobRoTT6v4XIKempaKSYPpwlMsmP_9vl4Ds35y0kgqvH7-FM6jsAI8W9OQgGmUG7UEVyroJU5wAstauWgNE-OIfZvYS9yhBlVk70Hy2-Yo3m2xJLw4yZXvTFgpHl9ahTAO1J--d0oTsV0y5S4-q7vgRu5xh1CfNuq66OMUtYzw3BlLl-Q2Mlmxb0or0LQjarO8M-DdLcepK99mqvhRt29gmc0NZlo27foghduA9N-4zG2f0sJnZrM7l09D_OBuWoVVrY-BR2rUK-32RIKxnfx3GVZSwM9hgMIiXkulaxrxf0U-SRlRmV_yMC9gn7RRZSlpJukXIzyDbH6-4SlDDYzo3OG5JQn6NY6e5lgaQaG0g-hmBcQV-WwpJllnrPRxg7bbCqLZ4kV8RO4amCIdbL2-ivgmcWfeFLIEs98nrknIUWC8";

//   const headers = {
//     'Authorization': `Bearer ${BearerPodcastApi}`,
//     'Content-Type': 'application/json',
//   };

//   const query = `
//     query {
//       podcasts{
//         data {
//           title
//           description
//           imageUrl
//           url
//         }
//       }
//     }
//   `;

//   const body = JSON.stringify({ query });

//   try {
//     const response = await fetch(graphqlUrl, {
//       method: 'POST',
//       headers,
//       body,
//     });

//     if (!response.ok) {
//       console.error('Error response from Podchaser API:', response.status, response.statusText);
//       return [];
//     }

//     const data = await response.json();
//     console.log('API Response Data:', data);

//     // Extract podcast data
//     return data.data?.podcasts?.data?.map((item) => ({
//       title: item.title,
//       description: item.description,
//       image: item.imageUrl,
//       link: item.url,
//       type: 'Podcast',
//     })) || [];
//   } catch (error) {
//     console.error('Error fetching podcasts:', error);
//     return [];
//   }
// };

// Fetch Videos
export const getPodcasts = async (topic) => {
  // Add the word "podcast" to each topic
  const topicsWithPodcast = topic
    .split(",")
    .map((topic) => `${topic.trim()} podcast`)
    .join(" | "); // Use " | " for OR search in YouTube Data API
    console.log("topics for podcasts:", topicsWithPodcast);
  const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topicsWithPodcast)}&key=${apiKeyForBooksAndVideos}&type=video&maxResults=40`;
  try {
    const response = await fetchWithRetry(youtubeSearchUrl);
    console.log("podcast results", response);
    console.log("video response", response);
    return response.items?.map((item) => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      image: item.snippet.thumbnails.default.url,
      type: 'Video',
    })) || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

// Fetch webinars
export const getWebinars = async (topic) => {
  // Add the word "podcast" to each topic
  const topicsWithWebinars = topic
    .split(",")
    .map((topic) => `${topic.trim()} webinar`)
    .join(" | "); // Use " | " for OR search in YouTube Data API
    console.log("topics for podcasts:", topicsWithWebinars);
  const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topicsWithWebinars)}&key=${apiKeyForBooksAndVideos}&type=video&maxResults=40`;
  try {
    const response = await fetchWithRetry(youtubeSearchUrl);
    console.log("webinar results", response);
    return response.items?.map((item) => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      image: item.snippet.thumbnails.default.url,
      type: 'Video',
    })) || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
// export const getPodcasts = async (topics, numResults = 10) => {
//   const graphqlUrl = "https://api.podchaser.com/graphql";
//   const BearerPodcastApi = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZDdhNGEzYS1iNDQwLTQ4M2YtYjI4Mi02OGU1NjRjNTA1ZWMiLCJqdGkiOiJiZDNlMDU0OWMxY2Y4YWQ1MGYyYzc4Y2Y5M2RmMDRlODU2ODEwZDY3YzM2ODUzZGYzNTQyMzVmZDljMzU4MjViZWE1M2FkNmZjM2VjMTE0NiIsImlhdCI6MTczMTUwNjY2Ni44NTE4MjYsIm5iZiI6MTczMTUwNjY2Ni44NTE4MjgsImV4cCI6MTc2MzA0MjY2Ni44NDE1OTIsInN1YiI6IiIsInNjb3BlcyI6WyIqIl19.nic6eB0G1INAv7RlzF5EzrffedLNsWJa4e8wxUCirf4178Ob4EnsMX2OtGyVifskgUFOJ27AqkS6mcy0QKLHWKbV7LqIjvVeyHcY8_6bSB9OIWyKxiSVoqYYz4g1JwT1b63p-F4ztH3l7GgVBBiaXq5g3TpnnAfw2KQ50IcNnztveiHfI3IK0H9gk1e2IQG3OBFwg790u7-d4YD3B1Iv_mc-m1X7yB2B3tPV5w7DMJB4ztxPBaFLSLElgnUbrkobRoTT6v4XIKempaKSYPpwlMsmP_9vl4Ds35y0kgqvH7-FM6jsAI8W9OQgGmUG7UEVyroJU5wAstauWgNE-OIfZvYS9yhBlVk70Hy2-Yo3m2xJLw4yZXvTFgpHl9ahTAO1J--d0oTsV0y5S4-q7vgRu5xh1CfNuq66OMUtYzw3BlLl-Q2Mlmxb0or0LQjarO8M-DdLcepK99mqvhRt29gmc0NZlo27foghduA9N-4zG2f0sJnZrM7l09D_OBuWoVVrY-BR2rUK-32RIKxnfx3GVZSwM9hgMIiXkulaxrxf0U-SRlRmV_yMC9gn7RRZSlpJukXIzyDbH6-4SlDDYzo3OG5JQn6NY6e5lgaQaG0g-hmBcQV-WwpJllnrPRxg7bbCqLZ4kV8RO4amCIdbL2-ivgmcWfeFLIEs98nrknIUWC8";

//   const headers = {
//     Authorization: `Bearer ${BearerPodcastApi}`,
//     "Content-Type": "application/json",
//   };

//   const query = `
//     query($filter: PodcastFilters, $first: Int!) {
//       podcasts(filters: $filter, first: $first) {
//         data {
//           title
//           description
//           imageUrl
//           url
//         }
//       }
//     }
//   `;

//   const variables = {
//     filter: { categories: topics.split(",") }, // Replace 'categories' with the correct field
//     first: numResults,
//   };

//   const body = JSON.stringify({ query, variables });

//   try {
//     const response = await fetch(graphqlUrl, {
//       method: "POST",
//       headers,
//       body,
//     });

//     if (!response.ok) {
//       console.error(
//         "Error response from Podchaser API:",
//         response.status,
//         response.statusText
//       );
//       return [];
//     }

//     const data = await response.json();
//     console.log("API Response Data:", data);

//     // Extract podcast data
//     return (
//       data.data?.podcasts?.data?.map((item) => ({
//         title: item.title,
//         description: item.description,
//         image: item.imageUrl,
//         link: item.url,
//         type: "Podcast",
//       })) || []
//     );
//   } catch (error) {
//     console.error("Error fetching podcasts:", error);
//     return [];
//   }
// };




// Fetch Webinars
// export const getWebinars = async (topic) => {
//   const customSearchUrl = `https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&q=${encodeURIComponent(`${topic} webinar OR conference`)}&key=${apiKeyForWebinars}&num=${numResults}`;
//   try {
//     const response = await fetchWithRetry(customSearchUrl);
//     return response.items?.map((item) => ({
//       title: item.title,
//       link: item.link,
//       snippet: item.snippet,
//       type: 'Webinar',
//     })) || [];
//   } catch (error) {
//     console.error('Error fetching webinars:', error);
//     return [];
//   }
// };
// export const getWebinars = async (topic, numResults = 5) => {
//   const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/search/?q=${encodeURIComponent(topic)}&categories=103&sort_by=date&location.address=online&expand=organizer,venue&page_size=${numResults}`;

//   const headers = {
//     'Authorization': `Bearer ${apiKeyForWebinars}`,
//     'Content-Type': 'application/json',
//   };

//   try {
//     const response = await fetch(eventbriteUrl, {
//       method: 'GET',
//       headers,
//     });

//     if (!response.ok) {
//       console.error('Error response from Eventbrite API:', response.status, response.statusText);
//       return [];
//     }

//     const data = await response.json();
//     console.log('API Response Data:', data);

//     // Extract webinar data
//     return data.events?.map((event) => ({
//       title: event.name.text,
//       link: event.url,
//       snippet: event.description.text,
//       startDate: event.start.utc,
//       type: 'Webinar',
//     })) || [];
//   } catch (error) {
//     console.error('Error fetching webinars from Eventbrite:', error);
//     return [];
//   }
// };


// src/api/getWebinars.js
// export const getWebinars = async (topic, numResults = 5) => {
//   // Replace with your actual private token
//   const apiKeyForWebinars = "O7NVRVWPDXHN4QGO6IUU";
//   const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/search/?q=${encodeURIComponent(topic)}&online_event=true&page_size=${numResults}`;

//   const headers = {
//     'Authorization': `Bearer ${apiKeyForWebinars}`,
//     'Content-Type': 'application/json',
//   };

//   try {
//     const response = await fetch(eventbriteUrl, {
//       method: 'GET',
//       headers,
//     });

//     // Check if the response is not OK
//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error(`Error response from Eventbrite API: ${response.status} - ${response.statusText}`);
//       console.error('Error Details:', errorData);
//       return [];
//     }

//     // Parse the JSON response
//     const data = await response.json();
//     console.log('API Response Data:', data);

//     // Extract webinar data
//     return data.events?.map((event) => ({
//       title: event.name.text,
//       link: event.url,
//       snippet: event.description.text,
//       startDate: event.start.utc,
//       type: 'Webinar',
//     })) || [];
//   } catch (error) {
//     console.error('Error fetching webinars from Eventbrite:', error);
//     return [];
//   }
// };



export const forgotPassword = async (requestData) => {
  const apiUrl = `/pub/forgotPassword`;

  try {
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
  } catch {
    toast.error('Error!')
  }


};

export const verifyOTP = async (requestData) => {
  const apiUrl = `/pub/verifyOTP`;

  try {
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
  } catch {
    toast.error('Error!')
  }

};

export const resetPassword = async (requestData) => {
  const apiUrl = `/pub/resetPassword`;

  try {
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
  } catch {
    toast.error('Error!')
  }

};

export const UpdateUser = async (data) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/updateUserProfile`;

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//
export const UpdateUserFromStartUpQuestions = async (data) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/UpdateUserFromStartUpQuestions`;
  console.log("Persona data in front controller", data);

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//gamification
export const getUserGamifications = async (data, token) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/GetUserGamification/${currentUser.user.id}`;
  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  return res.json();
};

export const getUserGamificationsbyCompnay = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const apiUrl = `/api/GetUserGamificationbycompany/${currentUser.company.id}`;
  const res = await fetch(baseURL + apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });
  return res.json();
};


export const deleteCategory = async (id) => {
  const apiUrl = "/api/deleteCategory";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    id: id,
  
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const updateSubCategory = async (id,name) => {
  const apiUrl = "/api/updateSubCategory";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    id: id,
    name:name,

 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const deleteSubCategory = async (id,name) => {
  const apiUrl = "/api/deleteSubCategory";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    id: id,

 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getSubCategories = async (categoryId) => {
  const apiUrl = "/api/getSubCategoryById";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    categoryId: categoryId,
 
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const createSubCategory = async (categoryId,name,companyId) => {
  const apiUrl = "/api/createSubCategory";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    categoryId: categoryId,
    name:name,
    companyId:companyId,
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const updateCategory = async (id,name) => {
  const apiUrl = "/api/updateCategory";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    id: id,
    name:name,
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


export const getGamesBySubCategory = async ( subCategoryId) => {
  const apiUrl = "/api/getGamesBySubCategory";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    subCategoryId:subCategoryId,
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};



export const deleteGame = async (id, name) => {
  const apiUrl = "/api/deleteGame";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    id:id
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const updateGame = async (id, name) => {
  const apiUrl = "/api/updateGame";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    id:id, name:name,
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const createGame = async (name, subCategoryId) => {
  const apiUrl = "/api/createGame";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    name:name, subCategoryId:subCategoryId,
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getAllCategories = async (companyId) => {
  const apiUrl = "/api/getAllCategories";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    companyId: companyId,
 
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createCategory = async (companyId, name) => {
  const apiUrl = "/api/createCategory";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    companyId: companyId,
    name:name,
   
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateUserGamification = async (selectedCategory, updatedPoints) => {
  const apiUrl = "/api/updateUserGamification";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    gamification: selectedCategory,
    points:updatedPoints,
    id: currentUser.user.id,
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createCompanyGamification = async (data, token) => {
  const apiUrl = "/api/createGamifications";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCompanyGamifications = async (token, companyId) => {
  const apiUrl = "/api/getGamifications";
  const data = {
    companyId: companyId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createDailyQuestionnaire = async (data, token) => {
  console.log(data);
  console.log(token);
  const apiUrl = "/api/companyAdmin/createDailyQuestionnaire";

  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`, // Send token for authentication
    },
    body: JSON.stringify(data),
  });

  return res.json(); // Return the response from the API
};

// src/api.js
export const fetchDailyQuestionsForCompany = async (companyId, token) => {
  // const apiUrl = `/api/companyAdmin/fetchDailyQuestionsForCompany/${companyId}`;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/fetchDailyQuestionsForCompany/${currentUser.company.id}`;

  try {
    const res = await fetch(baseURL + apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": `${currentUser.token}`, // Send token for authentication
      },
    });

    // Check if the response is okay (status 200-299)
    if (!res.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await res.json();
    return data; // Return the response from the API

  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const updateDailyQuestionForCompany = async (selectedCategory, updatedPoints) => {
  const apiUrl = "/api/companyAdmin/updateDailyQuestionForCompany";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const data = {
    questionId: selectedCategory,
    points:updatedPoints,
    id: currentUser.user.id,
    
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
//deleteDailyQuestionForCompany
export const deleteDailyQuestionForCompany = async (token, id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = `/api/companyAdmin/deleteDailyQuestionForCompany/${id}`;

  const res = await fetch(baseURL + apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${currentUser.token}`,
    },
  });

  //res.status === 204 ? window.location.reload() : toast.error('Error while deleting')
};

//getDailyQuestionsForCompany
export const getDailyQuestionsForCompany = async (token, parsedUserData) => {
  // Show a loading toast before making the request
  const loadingToast = toast.info('Loading questions...', { 
    position: "top-right", 
    autoClose: false,  // Keep the toast open indefinitely
    closeOnClick: false,
    draggable: false,
  });

  const apiUrl = `/api/getDailyQuestionsForCompany/${parsedUserData.company.id}`;

  try {
    const res = await fetch(baseURL + apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": `${token}`, // Send token for authentication
      },
    });

    // Check if the response is okay (status 200-299)
    if (!res.ok) {
      throw new Error("Failed to fetch questions");
    }
    // Dismiss the loading toast once the response is received
    toast.dismiss(loadingToast);
    const data = await res.json();
    
    return data; // Return the response from the API

  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};


//Project 

export const ClearBoardAndAssociations = async (token,id) => {
  const apiUrl = "/api/ClearBoardAndAssociations";

  const data = {
   
    id: id,
 
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

//Delete Board 
export const deleteBoardAndAssociations = async (token,id) => {
  const apiUrl = "/api/deleteBoardAndAssociations";

  const data = {
   
    id: id,
 
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateSubTaskStatus = async (token,subTaskId,status,updatedBy) => {
  const apiUrl = "/api/updateSubTaskStatus";

  const data = {
   
    subTaskId: subTaskId,
    status:status,
    updatedBy:updatedBy,

  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const createtaskchat = async (token,taskId,userId,message,imageUrl,attachmentUrl,link) => {
  const apiUrl = "/api/task-chat";

  const data = {
   
    taskId: taskId,
    userId:userId,
    message:message,
    imageUrl:imageUrl,
    attachmentUrl:attachmentUrl,
    link:link
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


export const updateTaskBoardId = async (token,taskId,newBoardId,userId) => {
  const apiUrl = "/api/updateTaskBoard";

  const data = {
   
    taskId: taskId,
    newBoardId:newBoardId,
    userId:userId,
   
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


export const updateTaskBoardUser = async (token,taskId,newAssignee,userId) => {
  const apiUrl = "/api/updateTaskUser";

  const data = {
   
    taskId: taskId,
    newAssignee:newAssignee,
    userId:userId,
   
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const Create_SubTask = async (token,taskTitle,assignee,description,deadline,taskId) => {
  const apiUrl = "/api/Create_SubTask";

  const data = {
   
    title: taskTitle,
    description:description,
  
    taskId:taskId,
    assignedTo:assignee,
    deadline:deadline,
  
  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createtask = async (token,taskTitle,assignee,description,deadline,tags,selectedcolumn) => {
  const apiUrl = "/api/create-task";

  const data = {
   
    title: taskTitle,
    assignedTo:assignee,
    deadline:deadline,
    tag:tags,
    description:description,
    boardId:selectedcolumn,
  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const createboard = async (token,companyId,boardname,projectId) => {

  const apiUrl = "/api/create-board";

  const data = {
   
    companyId: companyId,
    name:boardname,

    projectId:projectId,
  };


  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const gettaskchat = async (token,taskId) => {
  const apiUrl = "/api/gettaskchat";

  const data = {
   
    taskId: taskId,
   
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getProjectsforUser= async (token,userId) => {
  const apiUrl = "/api/getProjectsforUser";

  const data = {
 
   
    userId:userId
  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getProjectsBTeamid= async (token,teamid) => {
  const apiUrl = "/api/getProjectsBTeamid";

  const data = {
 
   
    teamid:teamid
  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getallboards = async (token,companyId) => {
  const apiUrl = "/api/getAllBoardsByCompanyId";

  const data = {
   
    companyId: companyId,
 
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getTeamuser = async (token, teamId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let apiUrl = `/api/getteamuser`;
  

  const data = {
    id: teamId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAlldepartmentuser = async (token, departmentId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let apiUrl = `/api/getdepartmentuser`;
  

  const data = {
    departmentId: departmentId,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};


//Notification 
export const getNotificationsByUserId = async (token,userId) => {
  const apiUrl = "/api/getNotificationsByUserId";

  const data = {
   
    userId: userId,
  

  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const markAllNotificationsAsRead = async (token,userId) => {
  const apiUrl = "/api/markAllNotificationsAsRead";

  const data = {
   
    userId: userId,
  

  
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getTeamMembersbyuser = async (token, id) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let apiUrl = `/api/getTeamMembersbyteam`;
  

  const data = {
    id: id,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": `${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const allgetFunctionDepartments = async (token, compnayid) => {
  const apiUrl = "/api/getallFunctionDepartments";
  const data = {
    compnayid: compnayid,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}


export const Board_Progress = async (token, compnayid) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const apiUrl = "/api/Board_Progress";
  const data = {
    companyId: currentUser.company.id,
  };
  const res = await fetch(baseURL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": currentUser.token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
