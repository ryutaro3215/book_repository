import { Box, Text, Alert, SimpleGrid } from "@chakra-ui/react";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";

export default function BookListPage () {
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const STORAGE_KEY = "myBookShelf";

  const getSavedBooks = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return [];
      return JSON.parse(savedData);
      } catch (error) {
        setShowAlert(true);
      }
  } 

  useEffect(() => {
    const books = getSavedBooks();
    setSavedBooks(books);
  }, []);

  const toggleSaveBook = (book: any) => {
    const current = getSavedBooks();
    const updated = current.filter((b: any) => b.id !== book.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedBooks(updated);
  }

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
      <SimpleGrid columns={[1, null, 2]} gap="20px">
        {savedBooks.map((book, index) => {
            return (
              <Box key={index}>
                <BookCard volumeInfo={book.volumeInfo || book} isSaved={true} onToggleSave={() => toggleSaveBook(book)} />
              </Box>
            );
        })}
      </SimpleGrid>
      <Footer />
    </>
  );
}
