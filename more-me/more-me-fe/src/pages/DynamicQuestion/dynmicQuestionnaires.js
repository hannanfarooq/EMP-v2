import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, Grid, TextField } from '@mui/material';
import './DynamicQuestionnaire.css';
import { getUserQuestionnaire, getUserDynamicQuestions, getUserAttemptedQuestionnaire } from 'src/api';
import QuestionnaireDialog from './QuestionnaireDialog';
import ViewAnswersDialog from './ViewAnswersDialog';

const DynamicQuestionnaire = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
  const [dynamicQuestions, setDynamicQuestions] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [questionsForSelected, setQuestionsForSelected] = useState([]);
  const [completedQuestionnaires, setCompletedQuestionnaires] = useState([]);
  const [openViewAnswersDialog, setOpenViewAnswersDialog] = useState(false);
  const [selectedQuestionnaireAnswers, setSelectedQuestionnaireAnswers] = useState([]);
  const [selectedQuestionnaireTitle, setSelectedQuestionnaireTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const attemptedQuestionnaireListResponse = await getUserAttemptedQuestionnaire();
      const attemptedQuestionnaireList = attemptedQuestionnaireListResponse.data?.questions || [];
      const attemptedQuestionnaireIds = attemptedQuestionnaireList.map(item => item.questionnaireId);

      const questionnaireListResponse = await getUserQuestionnaire();
      const questionnaireList = questionnaireListResponse.data || [];
      const readyCategories = questionnaireList.filter(category => category.isReady && category.isLive);

      setCategories(readyCategories);
      setCompletedQuestionnaires(attemptedQuestionnaireIds);

      readyCategories.forEach(category => {
        fetchDynamicQuestions(category.id);
      });

      setSelectedQuestionnaireAnswers(attemptedQuestionnaireList); // Store all attempted answers
    } catch (error) {
      console.error('Failed to fetch question categories:', error);
    }
  };

  const fetchDynamicQuestions = async (questionnaireId) => {
    try {
      const response = await getUserDynamicQuestions(questionnaireId, storedUserData.company.id);
      const questions = response.data?.questions || [];
      setDynamicQuestions(prevState => ({
        ...prevState,
        [questionnaireId]: questions
      }));
    } catch (error) {
      console.error('Failed to fetch dynamic questions:', error);
    }
  };

  const handleFillQuestionnaire = (questionnaireId) => {
    setSelectedQuestionnaire(questionnaireId);
    setQuestionsForSelected(dynamicQuestions[questionnaireId] || []);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuestionnaire(null);
    setQuestionsForSelected([]);
  };

  const handleViewAnswers = (questionnaire) => {
    const completedQuestionnaire = selectedQuestionnaireAnswers.find(item => item.questionnaireId === questionnaire.id);
    const answers = completedQuestionnaire ? completedQuestionnaire.questionnaire.answers : [];
    setSelectedQuestionnaireAnswers(answers);
    setSelectedQuestionnaireTitle(questionnaire.questionnaireTitle);
    setSelectedQuestionnaire(questionnaire);
    setOpenViewAnswersDialog(true);
  };

  const handleCloseViewAnswersDialog = () => {
    setOpenViewAnswersDialog(false);
    fetchQuestionnaires();
  };

  const isQuestionnaireCompletedByUser = (questionnaireId) => {
    return selectedQuestionnaireAnswers.some(item => item.questionnaireId === questionnaireId && item.userId === storedUserData.user.id);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterCategories = (categories) => {
    return categories.filter((category) =>
      category.questionnaireTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderContent = () => {
    const filteredCategories = filterCategories(categories);

    if (filteredCategories.length === 0) {
      return (
        <Typography variant="h6" color="textSecondary" align="center" style={{ marginTop: '20px' }}>
          No questionnaires available
        </Typography>
      );
    }

    switch (activeTab) {
      case 'attempted':
        return (
          <Grid container spacing={3}>
            {filteredCategories
              .filter((category) => isQuestionnaireCompletedByUser(category.id))
              .map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">
                        Title: {category.questionnaireTitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {category.questionnaireDescription}
                      </Typography>
                      <Button
                        color="secondary"
                        onClick={() => handleViewAnswers(category)}
                      >
                        View Answers
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        );
      case 'unattempted':
        return (
          <Grid container spacing={3}>
            {filteredCategories
              .filter((category) => !isQuestionnaireCompletedByUser(category.id))
              .map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">
                        Title: {category.questionnaireTitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {category.questionnaireDescription}
                      </Typography>
                      <Button
                        color="primary"
                        onClick={() => handleFillQuestionnaire(category.id)}
                      >
                        Fill the Questionnaire
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        );
      case 'all':
      default:
        return (
          <Grid container spacing={3}>
            {filteredCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">
                      Title: {category.questionnaireTitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {category.questionnaireDescription}
                    </Typography>
                    {isQuestionnaireCompletedByUser(category.id) ? (
                      <Button
                        color="secondary"
                        onClick={() => handleViewAnswers(category)}
                      >
                        View Answers
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        onClick={() => handleFillQuestionnaire(category.id)}
                      >
                        Fill the Questionnaire
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
    }
  };

  return (
    <Container>
      <div className="tab-bar">
        <div 
          className={`tab-item ${activeTab === 'all' ? 'active' : ''}`} 
          onClick={() => setActiveTab('all')}
        >
          All Questions
        </div>
        <div 
          className={`tab-item ${activeTab === 'attempted' ? 'active' : ''}`} 
          onClick={() => setActiveTab('attempted')}
        >
          Attempted
        </div>
        <div 
          className={`tab-item ${activeTab === 'unattempted' ? 'active' : ''}`} 
          onClick={() => setActiveTab('unattempted')}
        >
          Unattempted
        </div>
      </div>
      <TextField
        label="Search Questionnaires"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {renderContent()}
      <QuestionnaireDialog
        open={openDialog}
        onClose={handleCloseDialog}
        storedUserData={storedUserData}
        questions={questionsForSelected}
        questionnaireId={selectedQuestionnaire}
        setCompletedQuestionnaires={setCompletedQuestionnaires}
      />
      <ViewAnswersDialog
        open={openViewAnswersDialog}
        onClose={handleCloseViewAnswersDialog}
        questionnaire={selectedQuestionnaire}
        answers={selectedQuestionnaireAnswers}
      />
    </Container>
  );
};

export default DynamicQuestionnaire;