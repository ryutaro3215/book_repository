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

  // console.log(books);
  // const [_, setRenderToggle] = useState(false);
  // const STORAGE_KEY = "myBookShelf";
  
  useEffect(() => {
    const fetchSavedBooks = async () => {
      const data = await getSavedBooks();
      setSavedBooks(data);
    }
    fetchSavedBooks();
  }, []);

  // const getSavedBooks = () => {
  //   return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // }

  // const isBookSaved = (book: any) => {
  //   const saved = getSavedBooks();
  //   return saved.some((b: any) => b.id === book.id);
  // }

  // const toggleSaveBook = async (book: any) => {
  //   // console.log("clicked: ", book);
  //   const savedBooks = getSavedBooks();
  //   const exists = savedBooks.some((b: any) => b.id === book.id);

  //   let updatedBooks;
  //   if (exists) {
  //     await fetch(`http://localhost:3000/books/${book.id}`, {
  //       method: "DELETE",
  //     });
  //     updatedBooks = savedBooks.filter((b: any) => b.id !== book.id);
  //   } else {
  //     await fetch(`http://localhost:3000/books`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(book),
  //     });
  //     updatedBooks = [...savedBooks, book];
  //   }
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  //   setRenderToggle((prev) => !prev); // Trigger a re-render
  //   console.log("updatedBooks: ", updatedBooks);
  // }
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
