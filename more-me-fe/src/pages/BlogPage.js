// import { useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// // @mui
// import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// // components
// import Iconify from '../components/iconify';
// import { ArticleCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// // mock
// import POSTS from '../_mock/blog';

// import { getArticles } from 'src/api';
// import { toast } from 'react-toastify';

// const SORT_OPTIONS = [
//   { value: 'latest', label: 'Latest' },
//   { value: 'popular', label: 'Popular' },
//   { value: 'oldest', label: 'Oldest' },
// ];

// // ----------------------------------------------------------------------

// export default function BlogPage() {
//   const [articles, setArticles] = useState([])

//   //const categories = JSON.parse(localStorage.getItem("userHobbies"));
//   // console.log("categories in blogPage", categories);
//   // console.log(categories);
//   const categories = {
//     name: "Baking",
//     name: "Hoteling",
//   }
//   console.log("get articles", getArticles);

//   const fetchArticles = async () => {
//     const promises = categories.map(category => {
//       return getArticles("Baking")
//         .then(data => {
//           return data.items
//         })
//         .catch(() => {
//           toast.error('Error while fetching')
//         }
//       )
//     });

//     // Promise.all(promises)
//     //   .then(data => {
//     //     const updArticles = [...articles, ...data].flat(Infinity)
//     //     setArticles(updArticles)
//     //   })
//     //   .catch(() => {
//     //     toast.error('Error while fetching')
//     //   })

//     // console.log(promises)
//   }

//   useEffect(() => {
//     if (categories.length) {
//       fetchArticles();
//     }
//   }, [])

//   return (
//     <>
//       <Helmet>
//         <title> Dashboard: Article | More.Me </title>
//       </Helmet>

//       <Container>
//         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
//           <Typography variant="h4" gutterBottom>
//             Articles
//           </Typography>
//           {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
//             New Article
//           </Button> */}
//         </Stack>

//         {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
//           <BlogPostsSearch posts={POSTS} />
//           <BlogPostsSort options={SORT_OPTIONS} />
//         </Stack> */}

//         <Grid container spacing={3}>
//           {articles.map((post, index) => (
//             <ArticleCard key={index} post={post} index={index} />
//           ))}
//         </Grid>
//       </Container>
//     </>
//   );
// }


import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import { ArticleCard } from '../sections/@dashboard/blog';
import { getArticles } from 'src/api';
import { toast } from 'react-toastify';
import { json } from 'react-router-dom';


const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

export default function BlogPage() {
  const [articles, setArticles] = useState([]);

  // Define categories for fetching articles
  
  //const categories = ["porn"];
  const categories = JSON.parse(localStorage.getItem("userHobbies"));
  console.log("hobbies", categories);

  const fetchArticles = async () => {
    const promises = categories.map(category => {
      return getArticles(category)
        .then(data => {
          console.log("Data from responce ", data);
          return data.items;
        })
        .catch(() => {
          toast.error('Error while fetching');
        });
    });

    Promise.all(promises)
      .then(data => {
        const updArticles = data.flat();
        setArticles(updArticles);
      })
      .catch(() => {
        toast.error('Error while fetching');
      });
  };

  useEffect(() => {
    if (categories.length) {
      fetchArticles();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard: Article | More.Me </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Articles
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {articles.map((post, index) => (
            <ArticleCard key={index} post={post} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
