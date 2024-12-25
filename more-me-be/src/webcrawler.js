// const axios = require('axios');
// const cheerio = require('cheerio');

// const websiteURL = 'https://medium.com/search?q=leadership+motivation'; // Replace this with the target website

// axios.get(websiteURL)
//   .then((response) => {
//     const html = response.data;
//     const $ = cheerio.load(html);


//     // Assuming articles are wrapped in a specific HTML element, such as 'div' or 'article'
//     const articles = $('div.s.ay.s'); // Change this selector to match the structure of the target website
//     console.log(articles)

//     articles.each((index, element) => {
//       const articleTitle = $(element).find('h2.title').text(); // Change this selector to match the article title structure
//       const articleURL = $(element).find('a').attr('href'); // Change this selector to match the article URL structure

//       console.log(`Title: ${articleTitle}`);
//       console.log(`URL: ${articleURL}\n`);
//     });
//   })
//   .catch((error) => {
//     console.log('Error fetching data:', error);
//   });


const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://bing-news-search1.p.rapidapi.com/news/search',
  params: {
    q: 'leadership',
    freshness: 'Day',
    textFormat: 'Raw',
    safeSearch: 'Off',
  },
  headers: {
    'X-BingApis-SDK': 'true',
    'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
    'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com',
  },
};

try {
  const response = axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}
