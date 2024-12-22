import styled from 'styled-components'

export const StyledQuestion = styled.div`
  .main {
    width: 100%;
  }

  .submit {
    width: 100%;
  }
  .question-option {
    display: inline-block;
  }

  .options-btn {
    margin-left: 10px;
    display: inline-block;
  }

  textarea {
    width: 100%;
    height: 200px;
    padding: 12px 20px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: #f8f8f8;
    font-size: 16px;
    resize: none;
  }

  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: stretch;
  }

  .score-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .options {
    padding: 0px 16px;
    text-align: center;
  }

  .count-down {
    text-align: right;
    margin: 80px 10px 0 auto;
    padding: 0px 40px;
    background-color: #ffcc0045;
    width: max-content;
    border: 1px solid #f1c40f;
    border-radius: 5%;
    color: #20232a;

    p {
      letter-spacing: 5px;
    }
  }
`
