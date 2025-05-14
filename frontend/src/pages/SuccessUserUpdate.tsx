
import { Box, Text } from '@chakra-ui/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SuccessUserCreate() {
  return (
    <>
      <Header />
      <Box margin="0 auto">
        <Text fontSize="4xl" ml="50px" mt="20px" mb="20px">Update User info successfully</Text>
      </Box>
      <Footer />
    </>
  )
}
