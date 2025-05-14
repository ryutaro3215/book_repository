import { Box, Heading, Flex, Link, HStack } from '@chakra-ui/react';
import { useAuth } from './AuthContext';

export default function Header() {
  const { user } = useAuth();
  const username = user ? user.username : "Guest";

  return (
    <> 
      <Box as="header" bg="blue.600" display="flex" flexDirection="row" height="100px">
        <Heading as="h1" size="lg" width="50%" height="auto" display="flex" alignItems="center" ml="20px"textStyle="4xl">
          <Link href="/" height="auto" >Book Repository</Link>
        </Heading>
        <Flex as="nav" width="50%" justify="flex-end">
          <Link href="/" color="white" fontSize="lg" mr={20}>Search</Link>
          <Link href="/books/" color="white" fontSize="lg" mr={20}>Repository</Link>
          {useAuth().user ? (
            <>
              <Link href="/profile" color="white" fontSize="lg" mr={20}>{username}</Link>
            </>
          ) : (
              <Link href="/login" color="white" fontSize="lg" mr={20}>Login</Link>
          )}
        </Flex> 
      </Box>
    </>
  )
}
