import { Text } from '@chakra-ui/react';
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function ErrorPage() {
  return (
    <>
      <Header />
      <Text fontSize="2xl" textAlign="center" marginTop="20px">
        404 - Page Not Found
      </Text>
      <Footer />
    </>
  )
}
