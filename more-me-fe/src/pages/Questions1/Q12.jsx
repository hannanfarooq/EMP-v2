// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   CircularProgress,
//   Card,
//   CardContent,
//   CardMedia,
//   IconButton,
//   Grid,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import axios from 'axios';

// const Q12 = ({ handleNext, handleAnswerChange }) => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [selectedBooks, setSelectedBooks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch books from the Google Books API based on the search term
//   useEffect(() => {
//     const fetchBooks = async () => {
//       if (searchTerm.trim() === '') return;

//       const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

//       if (!apiKey) {
//         console.error('Google Books API key is missing. Please check your .env file.');
//         return;
//       }

//       const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${apiKey}&maxResults=10`;

//       try {
//         setLoading(true);
//         const response = await axios.get(url);

//         const bookData = response.data.items.map((item) => ({
//           id: item.id,
//           title: item.volumeInfo.title,
//           author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
//           country: item.accessInfo.country || 'Unknown',
//           language: item.volumeInfo.language || 'Unknown',
//           year: item.volumeInfo.publishedDate || 'Unknown',
//           imageLink: item.volumeInfo.imageLinks?.thumbnail || '',
//           categories: item.volumeInfo.categories?.join(', ') || 'Unknown Category',
//           description: item.volumeInfo.description || 'No description available',
//           pageCount: item.volumeInfo.pageCount || 'Unknown page count',
//           infoLink: item.volumeInfo.infoLink || '#',
//         }));
//         setFilteredBooks(bookData);
//       } catch (error) {
//         console.error('Error fetching books:', error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const delayDebounceFn = setTimeout(() => {
//       if (searchTerm) {
//         fetchBooks();
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm]);

//   // Handle selecting a book (prevent duplicates)
//   const handleSelectBook = (book) => {
//     const isAlreadySelected = selectedBooks.some((b) => b.id === book.id);
//     if (!isAlreadySelected) {
//       setSelectedBooks([...selectedBooks, book]);
//     }
//   };

//   // Handle removing a selected book
//   const handleRemoveBook = (bookId) => {
//     const updatedBooks = selectedBooks.filter((book) => book.id !== bookId);
//     setSelectedBooks(updatedBooks);
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     // Extract book titles from the selected books and join them into a single string
//     const bookTitlesArray = selectedBooks.map((book) => book.title);
//     const concatenatedBookTitles = bookTitlesArray.join(', ');
  
//     // Create the answer object with a concatenated string
//     const answer = {
//       bookTitle: concatenatedBookTitles,
//     };
  
//     console.log("Submitting answer for books:", answer);
//     handleAnswerChange(answer, 'preference');
//     handleNext();
//   };

//   return (
//     <div style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
//       <Box sx={{ maxWidth: 1200, padding: 2, margin: '0 auto', textAlign:"center" }}>
//         <Typography variant="h4" gutterBottom sx={{marginTop:"40px"}}>
//           Question No 12: What books do you like the most?
//         </Typography>
//         <TextField
//           label="Enter book title"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           fullWidth
//           margin="normal"
//         />
//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
//             <CircularProgress />
//           </Box>
//         )}
//         <Box sx={{ maxHeight: 300, overflow: 'auto', marginBottom: 2 }}>
//           <List>
//             {filteredBooks.map((book) => (
//               <ListItem button onClick={() => handleSelectBook(book)} key={book.id}>
//                 <ListItemText primary={book.title} secondary={`Author: ${book.author}`} />
//               </ListItem>
//             ))}
//           </List>
//         </Box>

//         {/* Display selected books in a responsive grid */}
//         <Grid container spacing={2}>
//           {selectedBooks.map((book) => (
//             <Grid item xs={12} sm={6} md={4} lg={4} key={book.id}>
//               <Card
//                 onClick={() => window.open(book.infoLink, '_blank')}
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   position: 'relative',
//                   boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//                   borderRadius: 3,
//                   padding: 2,
//                   cursor: 'pointer',
//                   '&:hover': {
//                     boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
//                   },
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   image={book.imageLink}
//                   alt={book.title}
//                   sx={{ height: 150, borderRadius: 2 }}
//                 />
//                 <CardContent sx={{ flex: '1 0 auto', overflow: 'hidden' }}>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 'bold',
//                       color: '#333',
//                       textOverflow: 'ellipsis',
//                       overflow: 'hidden',
//                       whiteSpace: 'nowrap',
//                     }}
//                   >
//                     {book.title}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: '#555',
//                       textOverflow: 'ellipsis',
//                       overflow: 'hidden',
//                       whiteSpace: 'nowrap',
//                     }}
//                   >
//                     <strong>Author:</strong> {book.author}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: '#777' }}>
//                     <strong>Categories:</strong> {book.categories}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: '#999' }}>
//                     <strong>Year:</strong> {book.year}
//                   </Typography>
//                 </CardContent>
//                 <IconButton
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleRemoveBook(book.id);
//                   }}
//                   sx={{
//                     position: 'absolute',
//                     top: '8px',
//                     right: '8px',
//                     color: '#ffffff',
//                     backgroundColor: 'rgb(170, 196, 237)',
//                     '&:hover': {
//                       backgroundColor: '#2065D1',
//                     },
//                   }}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {selectedBooks.length > 0 && (
//           <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//         )}
//       </Box>
//     </div>
//   );
// };

// export default Q12;



import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Tooltip from '@mui/material/Tooltip';


const Q12 = ({ handleNext, handleAnswerChange }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openTipModal, setOpenTipModal] = useState(false);

  // Fetch books from the Google Books API based on the search term
  useEffect(() => {
    const fetchBooks = async () => {
      if (searchTerm.trim() === '') return;

      const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

      if (!apiKey) {
        console.error('Google Books API key is missing. Please check your .env file.');
        return;
      }

      const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${apiKey}&maxResults=10`;

      try {
        setLoading(true);
        const response = await axios.get(url);

        const bookData = response.data.items.map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
          country: item.accessInfo.country || 'Unknown',
          language: item.volumeInfo.language || 'Unknown',
          year: item.volumeInfo.publishedDate || 'Unknown',
          imageLink: item.volumeInfo.imageLinks?.thumbnail || '',
          categories: item.volumeInfo.categories?.join(', ') || 'Unknown Category',
          description: item.volumeInfo.description || 'No description available',
          pageCount: item.volumeInfo.pageCount || 'Unknown page count',
          infoLink: item.volumeInfo.infoLink || '#',
        }));
        setFilteredBooks(bookData);
      } catch (error) {
        console.error('Error fetching books:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchBooks();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle selecting a book (prevent duplicates)
  const handleSelectBook = (book) => {
    const isAlreadySelected = selectedBooks.some((b) => b.id === book.id);
    if (!isAlreadySelected) {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  // Handle removing a selected book
  const handleRemoveBook = (bookId) => {
    const updatedBooks = selectedBooks.filter((book) => book.id !== bookId);
    setSelectedBooks(updatedBooks);
  };

  // Handle form submission
  const handleSubmit = () => {
    const bookTitlesArray = selectedBooks.map((book) => book.title);
    const concatenatedBookTitles = bookTitlesArray.join(', ');

    const answer = {
      bookTitle: concatenatedBookTitles,
    };

    console.log("Submitting answer for books:", answer);
    handleAnswerChange(answer, 'preference');
    handleNext();
  };

  // Open/close the tip modal
  const handleOpenTipModal = () => setOpenTipModal(true);
  const handleCloseTipModal = () => setOpenTipModal(false);

  return (
    <div style={{ overflow: 'auto', scrollbarWidth: 'none', width: "100%" }}>
      <Box sx={{ maxWidth: 1200, padding: 2, margin: '0 auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ marginTop: '40px' }}>
          Question No 12: What books do you like the most?
        </Typography>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Enter book title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Tooltip title="Help" arrow>
          <IconButton
            onClick={handleOpenTipModal}
            sx={{marginTop:"15px", position: 'absolute', right: '10px', top: '10px', color: '#2065D1' }}
          >
            <InfoOutlinedIcon />
          </IconButton>
          </Tooltip>
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ maxHeight: 300, overflow: 'auto', marginBottom: 2 }}>
          <List>
            {filteredBooks.map((book) => (
              <ListItem button onClick={() => handleSelectBook(book)} key={book.id}>
                <ListItemText primary={book.title} secondary={`Author: ${book.author}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Grid container spacing={2}>
          {selectedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={book.id}>
              <Card
                onClick={() => window.open(book.infoLink, '_blank')}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: 3,
                  padding: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={book.imageLink}
                  alt={book.title}
                  sx={{ height: 150, borderRadius: 2 }}
                />
                <CardContent sx={{ flex: '1 0 auto', overflow: 'hidden' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Author:</strong> {book.author}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Categories:</strong> {book.categories}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Year:</strong> {book.year}
                  </Typography>
                </CardContent>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBook(book.id);
                  }}
                  sx={{ position: 'absolute', top: '8px', right: '8px', color: '#ffffff', backgroundColor: 'rgb(170, 196, 237)', '&:hover': { backgroundColor: '#2065D1' } }}
                >
                  <CloseIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedBooks.length > 0 && (
          <Button
          className="mt-10 w-60"
          variant="outlined"
          onClick={handleSubmit}
          endIcon={<ArrowForwardIcon />}
        >
          Next!
        </Button>
        )}

        <Dialog open={openTipModal} onClose={handleCloseTipModal}>
          <DialogTitle>How to Use the Book Search</DialogTitle>
          <DialogContent>
            <Typography>1. Enter the title of a book to search.</Typography>
            <Typography>2. Select a book from the dropdown list.</Typography>
            <Typography>3. You can select multiple books by repeating the search.</Typography>
            <Typography>4. Click on a selected book to view more details or remove it using the close icon.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTipModal}>Got it!</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default Q12;