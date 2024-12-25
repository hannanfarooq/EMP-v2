import { ToastContainer, toast } from 'react-toastify'

import { StyledQuestion } from './Question.styled'
import { Button, Card, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { getCompanyGamifications } from 'src/api'
import { useEffect, useState } from 'react'
import { question_emojies } from 'src/utils/baseURL'

const GamificationsList = props => {
  const [questions, setQuestions] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  const fetchCompanyQuestions = async () => {
    const questions = await getCompanyGamifications(
      storedUserData.token,
      storedUserData.company.id
    );
if (questions.data) {
  setQuestions(questions?.data?.gamifications);

    localStorage.setItem('categories', JSON.stringify(questions.data.categories))
  };
}
    

  useEffect(() => {
    console.log("hwllo");
    fetchCompanyQuestions()
  }, []);

  const questionsList = (questions || []).map((value, index) => {
    const { companyId, id, text, type, options, correctOption } = value

    // const handleDelete = () => {
    //   deleteQuestion(id).then(response => {
    //     if (response.code === 200) {
    //       fetchCompanyQuestions()
    //       toast.success(`Question deleted!`)
    //       return
    //     }
    //     toast.error(`Some error occured`)
    //   })
    // }

    return (
        <div className="rounded-lg border-solid border-2 border-gray-300 p-4 m-2 max-w-full cursor-default">
          <div className="mb-4">
            <h4 className="text-lg font-bold">{`Q${index + 1}: ${text}`}</h4>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-4">Options:</p>

            {(type === "multiple-choice" || type === "single-choice") && (
              <div className="grid grid-cols-1 gap-4">
              {options.map((option, index) => {
                return (
                    <div key={index} className="flex items-center p-2 bg-gray-100 rounded-lg">
                      <p className="text-sm">{option}</p>
                    </div>
                );
              })}
            </div>
            )}

            {type === "emoji" && (
              <div className="flex flex-wrap">
                {question_emojies.map((emoji, index) => (
                  <div key={index} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 mr-2 mb-2">
                    <span className="text-3xl">{emoji.name}</span>
                  </div>
                ))}
              </div>
            )}

            {type === "yes-no" && (
              <div className="flex">
                {["✅ Yes", "❌ No"].map((emoji, index) => (
                  <div key={index} className="flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 mr-2 mb-2 px-3 py-2">
                    <span className="text-lg">{emoji}</span>
                  </div>
                ))}
              </div>
            )}

            {type === "multiple-img-choice" && (
              <div className="grid grid-cols-1 gap-4">
                {options.map((option, index) => {
                  const { img, text } = JSON.parse(option);
                  return (
                    <div key={index} className="flex items-center p-2 bg-gray-100 rounded-lg">
                      <img src={img} alt="option" className="w-10 h-10 rounded-full mr-3" />
                      <p className="text-sm">{text}</p>
                      <input type="checkbox" disabled className="ml-auto" />
                    </div>
                  );
                })}
              </div>
            )}

                <div>
                    <p className="text-sm font-semibold mb-4 mt-4">Correct Option:</p>
                    <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                      <p className="text-sm">{correctOption}</p>
                    </div>
                </div>
          </div>
        </div>

    )
  })

  return (
    <>
      {!questions?.length ? <div className='no-content'>Company has no gamifications</div> : questionsList}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default GamificationsList
