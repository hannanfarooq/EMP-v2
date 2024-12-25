// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Card, CardContent, Button, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';

// const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#FF8042', '#00C49F'];

// const ShowResponsesModal = ({ open, handleClose, userResponses = {}, questionnaireTitle, dynamicQuestions = {} }) => {
//   console.log("dynamicQuestions", dynamicQuestions);

//   const getYesNoAnswers = (answers = []) => {
//     return answers.filter(answer => answer.type === "yes-no");
//   };

//   const getSingleChoiceAnswers = (answers = []) => {
//     return answers.filter(answer => answer.type === "single-choice");
//   };

//   const getEmojiAnswers = (answers = []) => {
//     return answers.filter(answer => answer.type === "emoji");
//   };

//   const extractYesNoText = (text) => {
//     return text.replace(/[^a-zA-Z]/g, '').trim();
//   };

//   const countYesNoResponses = (answers = []) => {
//     let yesCount = 0;
//     let noCount = 0;
//     answers.forEach(answer => {
//       const extractedText = extractYesNoText(answer.selectedOption);
//       if (extractedText === "Yes") {
//         yesCount += 1;
//       } else if (extractedText === "No") {
//         noCount += 1;
//       }
//     });
//     return [{ name: 'Yes', value: yesCount }, { name: 'No', value: noCount }];
//   };

//   const countSingleChoiceResponses = (answers = [], options = []) => {
//     //console.log("answers and options:", answers, options);
//     if (options.length === 0) {
//       // Fallback: create options from answers if options are not provided
//       options = [...new Set(answers.map(answer => answer.selectedOption))];
//       //console.log("Fallback options:", options);
//     }

//     const counts = options.map(option => ({ name: option, value: 0 }));
//     answers.forEach(answer => {
//       const selectedOption = answer.selectedOption;
//       const optionIndex = counts.findIndex(count => count.name === selectedOption);
//       if (optionIndex !== -1) {
//         counts[optionIndex].value += 1;
//       }
//     });
//     //console.log("counts", counts);
//     return counts;
//   };

//   const countEmojiResponses = (answers = []) => {
//     const counts = answers.reduce((acc, answer) => {
//       const emoji = answer.selectedOption;
//       if (!acc[emoji]) {
//         acc[emoji] = { name: emoji, value: 0 };
//       }
//       acc[emoji].value += 1;
//       return acc;
//     }, {});
//     return Object.values(counts);
//   };

//   const groupResponsesByQuestion = (responses = []) => {
//     const grouped = {};
//     responses.forEach(response => {
//       const answers = response.questionnaire.answers;
//       getYesNoAnswers(answers).forEach(answer => {
//         if (!grouped[answer.title]) {
//           grouped[answer.title] = [];
//         }
//         grouped[answer.title].push(answer);
//       });
//       getSingleChoiceAnswers(answers).forEach(answer => {
//         if (!grouped[answer.title]) {
//           grouped[answer.title] = [];
//         }
//         grouped[answer.title].push(answer);
//       });
//       getEmojiAnswers(answers).forEach(answer => {
//         if (!grouped[answer.title]) {
//           grouped[answer.title] = [];
//         }
//         grouped[answer.title].push(answer);
//       });
//     });
//     return grouped;
//   };

//   const groupedResponses = userResponses.questions ? groupResponsesByQuestion(userResponses.questions) : {};
//   const allQuestions = userResponses.questions ? userResponses.questions.flatMap(response => response.questionnaire.answers.map(answer => answer.title)) : [];
//   const uniqueQuestions = [...new Set(allQuestions)];

//   const renderPieChart = (answers, questionType, options = []) => {
//     if (questionType === "single-choice") {
//       return renderBarChart(answers, options);  // Call renderBarChart for single-choice questions
//     }

//     let data = [];
//     if (questionType === "yes-no") {
//       data = countYesNoResponses(answers);
//     } else if (questionType === "emoji") {
//       data = countEmojiResponses(answers);
//     }

//     const hasResponses = data.some(data => data.value > 0);

//     return hasResponses ? (
//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
//         <PieChart width={440} height={400}>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             outerRadius={150}
//             fill="#8884d8"
//             dataKey="value"
//             label={({ name, value }) => `${name}: ${value}`}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </div>
//     ) : (
//       <Typography variant="body1" component="p" align="center" sx={{ mt: 4 }}>
//         No response available
//       </Typography>
//     );
//   };

//   const renderBarChart = (answers, options = []) => {
//     const data = countSingleChoiceResponses(answers, options);
//     //console.log("bar chart data", data);

//     const hasResponses = data.some(data => data.value > 0);

//     return hasResponses ? (
//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
//         <BarChart width={600} height={400} data={data} layout="vertical">
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis type="number" />
//           <YAxis type="category" dataKey="name" />
//           <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" barSize={30}>
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//             <LabelList dataKey="value" position="insideRight" />
//           </Bar>
//         </BarChart>
//       </div>
//     ) : (
//       <Typography variant="body1" component="p" align="center" sx={{ mt: 4 }}>
//         No response available
//       </Typography>
//     );
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="show-responses-dialog-title"
//       maxWidth="md"
//       fullWidth
//     >
//       <DialogTitle id="show-responses-dialog-title">
//         {questionnaireTitle ? `${questionnaireTitle} - User Responses` : 'User Responses'}
//         <IconButton
//           aria-label="close"
//           onClick={handleClose}
//           sx={{ position: 'absolute', right: 8, top: 8 }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers>
//         <Grid container spacing={2}>
//           {uniqueQuestions.length > 0 ? (
//             uniqueQuestions.map((question, index) => {
//               const questionType = groupedResponses[question] && groupedResponses[question][0].type;
//               const dynamicQuestion = dynamicQuestions.questions && dynamicQuestions.questions.find(q => q.title === question);
//               const options = dynamicQuestion ? dynamicQuestion.options : [];
//               //console.log("Question:", question);
//               //console.log("Options:", options);
//               //console.log("Grouped Responses:", groupedResponses[question]);
//               return (
//                 <Grid item xs={12} key={index}>
//                   <Card>
//                     <CardContent>
//                       <Typography variant="h6" component="p">
//                         <strong>Question:</strong> {question}
//                       </Typography>
//                       <div style={{ marginTop: 16 }}>
//                         {renderPieChart(groupedResponses[question] || [], questionType, options)}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               );
//             })
//           ) : (
//             <Typography variant="body1" component="p">
//               No responses available.
//             </Typography>
//           )}
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="primary">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ShowResponsesModal;

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Card, CardContent, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#FF8042', '#00C49F'];

const ShowResponsesModal = ({ open, handleClose, userResponses = {}, questionnaireTitle, dynamicQuestions = {} }) => {
  console.log("dynamicQuestions", dynamicQuestions);

  const getYesNoAnswers = (answers = []) => {
    return answers.filter(answer => answer.type === "yes-no");
  };

  const getSingleChoiceAnswers = (answers = []) => {
    return answers.filter(answer => answer.type === "single-choice");
  };

  const getMultipleChoiceAnswers = (answers = []) => {
    return answers.filter(answer => answer.type === "multiple-choice");
  };

  const getEmojiAnswers = (answers = []) => {
    return answers.filter(answer => answer.type === "emoji");
  };

  const extractYesNoText = (text) => {
    return text.replace(/[^a-zA-Z]/g, '').trim();
  };

  const countYesNoResponses = (answers = []) => {
    let yesCount = 0;
    let noCount = 0;
    answers.forEach(answer => {
      const extractedText = extractYesNoText(answer.selectedOption);
      if (extractedText === "Yes") {
        yesCount += 1;
      } else if (extractedText === "No") {
        noCount += 1;
      }
    });
    return [{ name: 'Yes', value: yesCount }, { name: 'No', value: noCount }];
  };

  const countSingleChoiceResponses = (answers = [], options = []) => {
    if (options.length === 0) {
      options = [...new Set(answers.map(answer => answer.selectedOption))];
    }

    const counts = options.map(option => ({ name: option, value: 0 }));
    answers.forEach(answer => {
      const selectedOption = answer.selectedOption;
      const optionIndex = counts.findIndex(count => count.name === selectedOption);
      if (optionIndex !== -1) {
        counts[optionIndex].value += 1;
      }
    });
    console.log("countSingleChoiceResponses data:", counts);
    return counts;
  };

  const countMultipleChoiceResponses = (answers = [], options = []) => {
    console.log("countMultipleChoiceResponses answers", answers);
    
    if (options.length === 0) {
      const allSelectedOptions = answers.flatMap(answer => answer.selectedOption);
      options = [...new Set(allSelectedOptions)];
    }

    const counts = options.map(option => ({ name: option, value: 0 }));
    answers.forEach(answer => {
      if (Array.isArray(answer.selectedOption)) {
        answer.selectedOption.forEach(selectedOption => {
          const optionIndex = counts.findIndex(count => count.name === selectedOption);
          if (optionIndex !== -1) {
            counts[optionIndex].value += 1;
          }
        });
      }
    });
    console.log("countMultipleChoiceResponses data:", counts);
    return counts;
  };

  const countEmojiResponses = (answers = []) => {
    const counts = answers.reduce((acc, answer) => {
      const emoji = answer.selectedOption;
      if (!acc[emoji]) {
        acc[emoji] = { name: emoji, value: 0 };
      }
      acc[emoji].value += 1;
      return acc;
    }, {});
    return Object.values(counts);
  };

  const groupResponsesByQuestion = (responses = []) => {
    const grouped = {};
    responses.forEach(response => {
      const answers = response.questionnaire.answers;
      getYesNoAnswers(answers).forEach(answer => {
        if (!grouped[answer.title]) {
          grouped[answer.title] = [];
        }
        grouped[answer.title].push(answer);
      });
      getSingleChoiceAnswers(answers).forEach(answer => {
        if (!grouped[answer.title]) {
          grouped[answer.title] = [];
        }
        grouped[answer.title].push(answer);
      });
      getMultipleChoiceAnswers(answers).forEach(answer => {
        if (!grouped[answer.title]) {
          grouped[answer.title] = [];
        }
        grouped[answer.title].push(answer);
      });
      getEmojiAnswers(answers).forEach(answer => {
        if (!grouped[answer.title]) {
          grouped[answer.title] = [];
        }
        grouped[answer.title].push(answer);
      });
    });
    return grouped;
  };

  const groupedResponses = userResponses.questions ? groupResponsesByQuestion(userResponses.questions) : {};
  const allQuestions = userResponses.questions ? userResponses.questions.flatMap(response => response.questionnaire.answers.map(answer => answer.title)) : [];
  const uniqueQuestions = [...new Set(allQuestions)];

  const renderPieChart = (answers, questionType, options = []) => {
    if (questionType === "single-choice") {
      return renderBarChart(answers, options);  // Call renderBarChart for single-choice questions
    }

    if (questionType === "multiple-choice") {
      return renderBarChart(answers, options, true);  // Call renderBarChart for multiple-choice questions
    }

    let data = [];
    if (questionType === "yes-no") {
      data = countYesNoResponses(answers);
    } else if (questionType === "emoji") {
      data = countEmojiResponses(answers);
    }

    const hasResponses = data.some(data => data.value > 0);

    return hasResponses ? (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <PieChart width={440} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    ) : (
      <Typography variant="body1" component="p" align="center" sx={{ mt: 4 }}>
        No response available
      </Typography>
    );
  };

  const renderBarChart = (answers, options = [], isMultipleChoice = false) => {
    let data = [];
    if (isMultipleChoice) {
      data = countMultipleChoiceResponses(answers, options);
    } else {
      data = countSingleChoiceResponses(answers, options);
    }

    const hasResponses = data.some(data => data.value > 0);

    console.log("renderBarChart data:", data);

    return hasResponses ? (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <BarChart width={600} height={400} data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList dataKey="value" position="insideRight" />
          </Bar>
        </BarChart>
      </div>
    ) : (
      <Typography variant="body1" component="p" align="center" sx={{ mt: 4 }}>
        No response available
      </Typography>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="show-responses-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="show-responses-dialog-title">
        {questionnaireTitle ? `${questionnaireTitle} - User Responses` : 'User Responses'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {uniqueQuestions.length > 0 ? (
            uniqueQuestions.map((question, index) => {
              const questionType = groupedResponses[question] && groupedResponses[question][0].type;
              const dynamicQuestion = dynamicQuestions.questions && dynamicQuestions.questions.find(q => q.text === question);
              const options = dynamicQuestion ? dynamicQuestion.options : [];
              console.log(`Rendering question: ${question}, type: ${questionType}, options: ${options}`);
              return (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="p">
                        <strong>Question:</strong> {question}
                      </Typography>
                      <div style={{ marginTop: 16 }}>
                        {renderPieChart(groupedResponses[question] || [], questionType, options)}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography variant="body1" component="p">
              No responses available.
            </Typography>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowResponsesModal;
