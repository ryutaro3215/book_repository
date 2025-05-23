import { Box, Text, Alert, SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import Header from "../components/Header";
import { useSearchParams } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";
import { getSavedBooks, isBookSaved, toggleSaveBook } from "../components/ButtonLogic";

export default function SearchResultPage () {
  const [searchParams] = useSearchParams();
  const originalQuery = searchParams.get("query") || "";

  const query = originalQuery.trim().split("/\s+/");
  const formattedQuery = query.join("+");

  const MAX_RESULTS = 20; 

  const [books, setBooks] = useState<any[]>([]);
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setStartIndex(0);
    setBooks([]);
    setHasMoreBooks(true);
    setShowAlert(false);
    setSavedBooks([]);
  }, [formattedQuery]);


  //This effect fetches books from the Google Books API when the component mounts or when the startIndex or formattedQuery changes.
  useEffect(() => {
    if (!hasMoreBooks) return;

    setLoading(true);
    const fetchBooks = async () => { 
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${formattedQuery}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`);
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
          setHasMoreBooks(false);
          return;
        }
        setBooks((prevBooks) => [...prevBooks, ...data.items]);
      } catch (error) {
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [startIndex, formattedQuery]);

  //Observing the last book in the list to trigger loading more books when it comes into view
  const observer = useRef<IntersectionObserver | null>(null);

  const lastBookRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreBooks) {
        setStartIndex((prevIndex) => prevIndex + MAX_RESULTS);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMoreBooks]);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      const data = await getSavedBooks();
      setSavedBooks(data);
    }
    fetchSavedBooks();
  }, []);

  //force re-rendering the component to update the saved books state
  const [_, setRenderToggle] = useState(false);

  return (
    <>
      <Header />
      <Text fontSize="4xl" ml="50px" mt="20px" mb="20px" >Search Result: {originalQuery}</Text>
      <Box margin="0 auto" width="1100px">
        {showAlert && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to search books</Alert.Title>
              <Alert.Description>Failed to search books, please try again!!</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
        {books.length === 0 && !showAlert && (
          <Text>No books found for the query: {originalQuery}</Text>
        )}
        <SimpleGrid columns={[1, null, 2]} gap="20px">
          {books.map((book, index) => {
              const isLastBook = index === books.length - 1;
              return (
                <Box key={index} ref={isLastBook ? lastBookRef : undefined}>
                  <BookCard id={book.id} volumeInfo={book.volumeInfo} isSaved={isBookSaved(book, savedBooks)} onToggleSave={() => toggleSaveBook(book, savedBooks, setSavedBooks, setRenderToggle)} />
                </Box>
              );
          })}
        </SimpleGrid>
      </Box>
      {loading && (
        <VStack color="blue.500">
          <Spinner color="blue.500" />
          <Text color="blue.500">Loading next Book...</Text>
        </VStack>
      )}
      <Footer />
    </>
  );
}
