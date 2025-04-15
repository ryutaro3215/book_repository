import { Box, Card, Image, Button, Alert, Spinner, VStack, Text } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getSavedBooks, isBookSaved, toggleSaveBook } from "../components/ButtonLogic";

export default function BookDetailPage () {
  const { id } = useParams(); 
  const [book, setBook] = useState<any>(null);
  const [error, setError] = useState(false);
  const [savedBooks, setSavedBooks] = useState<any[]>([]);

  // console.log("id: ", id);
  useEffect(() => {
    setError(false);
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        setError(true);
      }
    };
    if (id) fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchSavedBooks = async () => {
        const data = await getSavedBooks();
        setSavedBooks(data);
      }
    fetchSavedBooks();
  }, []);

  // const [_, setRenderToggle] = useState(false);
  // const STORAGE_KEY = "myBookShelf";

  // const getSavedBooks = () => {
  //   return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // }

  // const isBookSaved = (book: any) => {
  //   if (!book) return false;
  //   const saved = getSavedBooks();
  //   return saved.some((b: any) => b.id === book.id);
  // }

  // const toggleSaveBook = (book: any) => {
  //   // console.log("clicked: ", book);
  //   const savedBooks = getSavedBooks();
  //   const exists = savedBooks.some((b: any) => b.id === book.id);

  //   let updatedBooks;
  //   if (exists) {
  //     updatedBooks = savedBooks.filter((b: any) => b.id !== book.id);
  //   } else {
  //     updatedBooks = [...savedBooks, book];
  //   }
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  //   setRenderToggle((prev) => !prev); // Trigger a re-render
  //   // console.log("updatedBooks: ", updatedBooks);
  // }
  
  const { title, authors, publisher, description, imageLinks } = book?.volumeInfo || {};
  const thumbnail = imageLinks?.thumbnail || imageLinks?.smallThumbnail;
  const authorsList = authors?.join(", ") || "Unknown Author";
  const [_, setRenderToggle] = useState(false);

  return (
    <>
      <Header />
      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Failed to search books</Alert.Title>
            <Alert.Description>Failed to search books, please try again!!</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
      <Card.Root flexDirection="row"  overflow="hidden" width="100vh" borderRadius="20px" margin="0 auto" padding="30px" mt="20px" mb="20px">
        {thumbnail && (
          <Box width="115px" ml="10px" p="0px 5px" display="flex" justifyContent="center" alignItems="center" >
            <Image src={thumbnail} alt={title} objectFit="contain" width="100%" height="100%"/>
          </Box>
        )}
        {!book && (
          <VStack color="blue.500">
            <Spinner color="blue.500" />
            <Text color="blue.500">Loading next Book...</Text>
          </VStack>
        )}
        <Box width="90%" >
          <Card.Body pb="0">
            <Card.Title lineClamp="2">{title}</Card.Title>
            <Card.Description >{authorsList}</Card.Description>
            <Card.Description >{publisher}</Card.Description>
            <Card.Description lineClamp={7} width="100%">{description}</Card.Description>
          </Card.Body>
          <Card.Footer pb="5px" pt="5px">
            <Button
              onClick={(e) => {e.stopPropagation(); toggleSaveBook?.(book, savedBooks, setSavedBooks, setRenderToggle)}}
              height="4/5"
              backgroundColor={isBookSaved(book, savedBooks) ? "blue" : "red"}>
              {isBookSaved(book, savedBooks) ? "Delete" : "Save"}
            </Button>
          </Card.Footer>
        </Box>
      </Card.Root>
      <Footer />
    </>
  )
}
