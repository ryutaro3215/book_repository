import { Box, Text } from "@chakra-ui/react";

export default function Footer () {
  return (
    <Box width="100%" height="40px" display="flex" justifyContent="center" alignItems="center" backgroundColor="#f0f0f0" bottom="0">
      <Text fontSize="sm">© 2023 Book Repository. All rights reserved.</Text>
    </Box>
  )
}
