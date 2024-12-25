// import axios from 'axios';

// const processWithLLM = async (token, feedbackData) => {
//   try {
//     // Prepare the feedback data for summarization
//     const feedbackText = feedbackData
//     .map(item => `Question: ${item.questionText}\nAnswer: ${item.answer}`)
//     .join(' ') + '\n\nPlease provide helpful medical tips or suggestions based on the answers above for mental health?';  

//     console.log('Feedback Text:', feedbackText);  // Log the feedback text

//     // Send request to Hugging Face API
//     // models/google/pegasus-xsum
//     // /models/facebook/bart-large-cnn
//     // models/gpt2
//     // models/EleutherAI/gpt-neo-2.7B
//     const response = await axios.post(
//       'https://api-inference.huggingface.co/models/Qwen/QwQ-32B-Preview',  // Choose the correct model
//       {
//         inputs: feedbackText, // Provide the feedback text for summarization
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,  // Your Hugging Face API token
//           'Content-Type': 'application/json', // Ensure the request is JSON
//         },
//       }
//     );
//     console.log("responce of model", response);
//     // Process the API response
//     if (response.data && response.data[0].generated_text) {
//       return {
//         code: 200,
//         data: {
//           summary: response.data[0].generated_text,  // Extract summary text
//         },
//       };
//     } else {
//       throw new Error('Error processing feedback');
//     }
//   } catch (error) {
//     console.error('Error with LLM API:', error);
//     return {
//       code: 500,
//       message: 'Error processing with LLM API',
//     };
//   }
// };

// export default processWithLLM;

import axios from 'axios';

const processWithLLM = async (token, feedbackData) => {
  try {
    // Prepare the feedback data for summarization
    const feedbackText = feedbackData
      .map(item => `Question: ${item.questionText}\nAnswer: ${item.answer}`)
      .join(' ') + '\n\nPlease provide helpful medical tips or suggestions based on the answers above for mental health?';  

    console.log('Feedback Text:', feedbackText);  // Log the feedback text

    // Send request to Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/Qwen/QwQ-32B-Preview',  // Choose the correct model
      {
        inputs: feedbackText, // Provide the feedback text for summarization
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Your Hugging Face API token
          'Content-Type': 'application/json', // Ensure the request is JSON
        },
      }
    );
    console.log("Response of model", response);

    // Process the API response
    if (response.data && response.data[0].generated_text) {
      // Remove the prompt text from the generated response
      const generatedText = response.data[0].generated_text;
      
      // Find where the prompt ends in the generated text and strip it
      const promptEndIndex = generatedText.indexOf('Please provide helpful medical tips');
      const modelResponse = generatedText.substring(promptEndIndex).trim(); // Get the response after the prompt
      
      return {
        code: 200,
        data: {
          summary: modelResponse,  // Extract summary text without the prompt
        },
      };
    } else {
      throw new Error('Error processing feedback');
    }
  } catch (error) {
    console.error('Error with LLM API:', error);
    return {
      code: 500,
      message: 'Error processing with LLM API',
    };
  }
};

export default processWithLLM;
