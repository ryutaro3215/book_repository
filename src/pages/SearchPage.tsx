import Header from "../components/Header";
import { Box, Button, Input, Text, Alert } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";

export default function SearchPage () {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setShowAlert(false);
      navigate(`/search/result?query=${encodeURIComponent(searchQuery)}`);
    }
    else {
      setShowAlert(true);
    }
  }

  return (
    <>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" width="1000px" margin="0 auto" height="90vh">
        <Text fontSize="4xl" mb="20px">Book Repository</Text>
        <Box verticalAlign="center" display="flex" justifyContent="center" alignItems="center" margin="0 auto" width="500px">
          <Input placeholder="Enter book name" size="md" width="100%" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </Box>
        {showAlert && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Empty query</Alert.Title>
              <Alert.Description>there is no query, input some word!!</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
        <Button width="100px" bg="red.500" color="white" mt="20px" onClick={handleSearch}>Search</Button>
        {/* <Text mt="20px" fontSize="2xl">SearchQuery: {searchQuery}</Text> */}
      </Box>
      <Footer />
    </>
  );
}
