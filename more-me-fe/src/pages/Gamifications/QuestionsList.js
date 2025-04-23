import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { getCompanyGamifications, getAllCategories, getSubCategories, getQuestionCategories, getGamesBySubCategory } from 'src/api';
import { useQuery } from 'react-query';

const GamificationsList = ({load,setLoad}) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [questions, setQuestions] = useState([]);
  const [gamesBySubCategory, setGamesBySubCategory] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState({});
  const [expandedQuestionCategory, setExpandedQuestionCategory] = useState({});
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [questionCategories, setQuestionCategories] = useState([]);
  // Fetch question categories using React Query
 
  
  useEffect(() => {
    fetchCategories();
    fetchQuestions();
    fetchQuestionCategories();
  }, []);
  useEffect(() => {
    if(load)  
    {
      fetchCategories();
      fetchQuestions();
      fetchQuestionCategories();
      setLoad(false);
    }
  }, [load]);
 const fetchQuestionCategories = async () => {
    try {
      const categoryList = await getQuestionCategories();
      if (categoryList?.data) {
        console.log("fetchQuestionCategories : ", categoryList);
        setQuestionCategories(categoryList.data);
      }
    } catch (error) {
      console.error('Failed to fetch question categories:', error);
    }
  };
  // Fetch categories and subcategories separately
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(storedUserData.company.id);
      setCategories(response.data);
      for (const category of response.data) {
        fetchSubCategories(category.id);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await getSubCategories(categoryId);
      setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    }
  };

  // Fetch only the questions (gamifications)
  const fetchQuestions = async () => {
    try {
      const response = await getCompanyGamifications(storedUserData.token, storedUserData.company.id);
      if (response?.data) {
        setQuestions(response.data.gamifications);
      }
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  // Fetch games for a given subcategory
  const fetchGamesForSubCategory = async (subCategoryId) => {
    try {
      const response = await getGamesBySubCategory(subCategoryId);
      if (response?.data) {
        console.log("getGamesBySubCategory : ", response);
        setGamesBySubCategory((prevState) => ({
          ...prevState,
          [subCategoryId]: response.data, // Save games by subcategory ID
        }));
      }
    } catch (error) {
      console.error('Failed to fetch games for subcategory:', error);
    }
  };

  return (
    <div>
      {/* Loading state */}
     

      {categories.length === 0 ? (
        <div className="no-content">Company has no gamifications</div>
      ) : (
        categories.map(category => (
          <Card key={category.id} className="mb-4 border border-gray-300 rounded-lg">
            <CardContent>
              <div className="flex justify-between items-center">
                <Typography variant="h5">{category.name}</Typography>
                <IconButton onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}>
                  {expandedCategory === category.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </div>

              {/* Expand Subcategories */}
              <Collapse in={expandedCategory === category.id}>
                {subcategories[category.id]?.length > 0 ? (
                  subcategories[category.id].map(subCategory => (
                    <Card key={subCategory.id} className="ml-4 my-2 border border-gray-200 rounded-lg">
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <Typography variant="h6">{subCategory.name}</Typography>
                          <IconButton
                            onClick={() => {
                              setExpandedSubCategory(prev => ({
                                ...prev,
                                [subCategory.id]: !prev[subCategory.id],
                              }));
                              // Fetch games when subcategory is expanded
                              if (!gamesBySubCategory[subCategory.id]) {
                                fetchGamesForSubCategory(subCategory.id);
                              }
                            }}
                          >
                            {expandedSubCategory[subCategory.id] ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </div>

                        {/* Expand Games */}
                        <Collapse in={expandedSubCategory[subCategory.id]}>
                          {gamesBySubCategory[subCategory.id]?.length > 0 ? (
                            gamesBySubCategory[subCategory.id].map(game => (
                              <Card key={game.id} className="ml-8 my-2 border border-gray-100 rounded-lg">
                                <CardContent>
                                  <div className="flex justify-between items-center">
                                    <Typography variant="subtitle1">{game.name}</Typography>
                                  </div>

                                  {/* Expand Question Categories */}
                                  {questionCategories.filter(qc =>  qc.gameid == game.id).length > 0 ? (
                                    questionCategories
                                      .filter(qc =>  qc.gameid === game.id)
                                      .map(questionCategory => (
                                        <Card key={questionCategory.id} className="ml-8 my-2 border border-gray-100 rounded-lg">
                                          <CardContent>
                                            <div className="flex justify-between items-center">
                                              <Typography variant="subtitle2">{questionCategory.name}</Typography>
                                              <IconButton
                                                onClick={() =>
                                                  setExpandedQuestionCategory(prev => ({
                                                    ...prev,
                                                    [questionCategory.id]: !prev[questionCategory.id],
                                                  }))
                                                }
                                              >
                                                {expandedQuestionCategory[questionCategory.id] ? <ExpandLess /> : <ExpandMore />}
                                              </IconButton>
                                            </div>

                                            {/* Expand Questions */}
                                            <Collapse in={expandedQuestionCategory[questionCategory.id]}>
                                              {questions.filter(q => q.questionCategoryId === questionCategory.id).length > 0 ? (
                                                questions
                                                  .filter(q => q.questionCategoryId === questionCategory.id)
                                                  .map((question, index) => (
                                                    <Card key={question.id} className="ml-12 my-2 border border-gray-50 rounded-lg p-3">
                                                      <Typography variant="body1" className="font-semibold">
                                                        Q{index + 1}: {question.text}
                                                      </Typography>
                                                      <Typography variant="body2" className="mt-2">
                                                        <strong>Type:</strong> {question.type}
                                                      </Typography>

                                                      {/* Display Options */}
                                                      {["multiple-choice", "single-choice"].includes(question.type) && (
                                                        <div className="mt-2">
                                                          <Typography variant="body2" className="font-semibold">Options:</Typography>
                                                          {question.options.map((option, i) => (
                                                            <Typography key={i} className="text-sm">
                                                              {option}
                                                            </Typography>
                                                          ))}
                                                        </div>
                                                      )}

                                                      {/* Display Correct Answer */}
                                                      <div className="mt-2">
                                                        <Typography variant="body2" className="font-semibold">Correct Answer:</Typography>
                                                        <Typography className="text-sm">{question.correctOption}</Typography>
                                                      </div>
                                                    </Card>
                                                  ))
                                              ) : (
                                                <Typography className="ml-12 mt-2 text-sm text-gray-500">
                                                  No questions available.
                                                </Typography>
                                              )}
                                            </Collapse>
                                          </CardContent>
                                        </Card>
                                      ))
                                  ) : (
                                    <Typography className="ml-8 mt-2 text-sm text-gray-500">
                                      No question categories available.
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Typography className="ml-8 mt-2 text-sm text-gray-500">
                              No games available.
                            </Typography>
                          )}
                        </Collapse>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography className="ml-4 mt-2 text-sm text-gray-500">
                    No subcategories available.
                  </Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ))
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
};

export default GamificationsList;
