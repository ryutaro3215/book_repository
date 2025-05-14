import { Box, Card, Image, Button, Alert, Spinner, VStack, Text } from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getSavedBooks, isBookSaved, toggleSaveBook } from "../components/ButtonLogic";
import { useAuth } from "../components/AuthContext";

export default function BookDetailPage () {
  const { id } = useParams(); 
  const [book, setBook] = useState<any>(null);
  const [error, setError] = useState(false);
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      setIsLogin(false);
    }
  }, [user, isLoading]);

  useEffect(() => {
    setError(false);
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`, {
        });
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
              disabled={!isLogin}
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
