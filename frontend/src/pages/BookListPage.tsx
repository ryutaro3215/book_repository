import { Box, Text, Alert, SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";
import { getSavedBooks, isBookSaved, toggleSaveBook } from "../components/ButtonLogic";

export default function BookListPage () {
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSavedBooks = async () => {
        const data = await getSavedBooks();
        setSavedBooks(data);
        setLoading(false);
      }
    fetchSavedBooks();
  }, []);

  const [_, setRenderToggle] = useState(false);

  return (
    <>
      <Header />
      <Text fontSize="4xl" ml="50px" mt="20px" mb="20px" >My Book Repository</Text>
      {savedBooks.length === 0 && (
        <Text>No books found in your repository.</Text>
      )}
      {showAlert && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Failed to get BookData</Alert.Title>
            <Alert.Description>Failed to get book data, please try again!!</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
      {loading && (
        <VStack color="blue.500">
          <Spinner color="blue.500" />
          <Text color="blue.500">Loading next Book...</Text>
        </VStack>
      )}
      <SimpleGrid columns={[1, null, 2]} gap="20px">
        {savedBooks.map((book, index) => {
            return (
              <Box key={index}>
                <BookCard id={book.id} volumeInfo={book.volumeInfo || book} isSaved={isBookSaved(book, savedBooks)} onToggleSave={() => toggleSaveBook(book, savedBooks, setSavedBooks, setRenderToggle)} />
              </Box>
            );
        })}
      </SimpleGrid>
      <Footer />
    </>
  );
}
