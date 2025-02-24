import { ToastContainer, toast } from 'react-toastify'

import { StyledQuestion } from './Question.styled'
import { Button, Card, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { deleteQuestion, getCompanyQuestions } from 'src/api'
import { useEffect, useState } from 'react'
import { question_emojies } from 'src/utils/baseURL'

const QuestionsList = props => {
  const [questions, setQuestions] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  const fetchCompanyQuestions = async () => {
    const questions = await getCompanyQuestions(
      storedUserData.token,
      storedUserData.company.id
    );

    setQuestions(questions?.data?.questions);
    localStorage.setItem('categories', JSON.stringify(questions.data.categories))
  };

  useEffect(() => {
    fetchCompanyQuestions()
  }, []);

  const questionsList = (questions || []).map((value, index) => {
    const { companyId, id, text, type, options } = value

    const handleDelete = () => {
      deleteQuestion(id).then(response => {
        if (response.code === 200) {
          fetchCompanyQuestions()
          toast.success(`Question deleted!`)
          return
        }
        toast.error(`Some error occured`)
      })
    }

    return (
      <StyledQuestion key={id}>
        <Card variant="outlined" className='p-4 m-2' cardSize='60%' margin='10px auto' cursor='default'>
          <div className='container'>
            <Typography variant='h4'>
              <b>Q{index + 1}:</b> {text}
            </Typography>

            <div className='score-btn'>
              {true ? (
                <Button onClick={() => handleDelete()} bgColor='red' padding='0.25em 1em'>
                  Delete
                </Button>
              ) : null}
            </div>
          </div>

          <div className=' m-0'>
            <Typography variant="body" gutterBottom className='m-0 p-0'>Options:</Typography>

            {(type == "multiple-choice" || type == "single-choice") && (
              <div className='pl-5'>
                {(options || []).map((item, index) => {
                  const { id, is_right, option } = item

                  return (
                    <ul key={index}>
                      <li>
                        {item}
                      </li>
                    </ul>
                  )
                })}
              </div>
            )}

            {(type == "emoji") && (
              <>
                <div className="justify-start	flex-nowrap flex flex-row">
                  {question_emojies.map((emoji) => (
                    <Card
                      className="flex justify-start px-1 py-1 m-2 cursor-default border-solid border-slate-400"
                    >
                      <Typography className="m-0 text-3xl">{emoji.name}</Typography>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {(type == "yes-no") && (
              <>
                <div className="justify-start	flex-nowrap flex flex-row">
                  {["✅ Yes", "❌ No"].map((emoji) => (
                    <Card
                      className="flex justify-start px-1 py-1 m-2 cursor-default border-solid border-slate-400"
                    >
                      <Typography className="m-0 text-2xl">{emoji}</Typography>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {(type == "multiple-img-choice") && (
              <div className='w-[358px]'>
                {options.map((option) => (
                  <Card className='flex items-center p-4 m-2' >
                    <img width={'50px'} height='50px' className='rounded-full' src={JSON.parse(option)?.img} />
                    <Typography className='ml-4'>{JSON.parse(option)?.text}</Typography>
                    <FormControlLabel className='ml-auto' control={<Checkbox disabled />} />
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </StyledQuestion>
    )
  })

  return (
    <>
      {!questions?.length ? <div className='no-content'>Company has No question</div> : questionsList}

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

export default QuestionsList
