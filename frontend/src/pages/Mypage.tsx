import { useAuth } from "../components/AuthContext";
import { useState, useEffect } from "react";
import { Spinner, Text, Flex, Heading, Fieldset, Field, Button, Input, Stack, Editable, IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function Mypage() {
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      setNewName(user.username);
      setNewEmail(user.email);
    }
  }, [user]);

  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }
  
  return (
    <>
      <Header />
        <Heading size="4xl" >My page</Heading>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%" height="90vh">
        <Text fontSize="2xl" mb="20px">Name</Text>
        <Editable.Root value={newName} onValueChange={(e) => setNewName(e.value)} border="1px solid black" w="md" borderRadius="3px" mb="20px">
          <Editable.Preview />
          <Editable.Input />
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton variant="ghost" size="xs">
                <LuPencilLine />
              </IconButton>
            </Editable.EditTrigger>
            <Editable.CancelTrigger asChild>
              <IconButton variant="outline" size="xs">
                <LuX />
              </IconButton>
            </Editable.CancelTrigger>
            <Editable.SubmitTrigger asChild>
              <IconButton variant="outline" size="xs">
                <LuCheck />
              </IconButton>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.Root>
        <Text fontSize="2xl" mb="20px">Email</Text>
        <Editable.Root value={newEmail} onValueChange={(e) => setNewEmail(e.value)} border="1px solid black" w="md" borderRadius="3px">
          <Editable.Preview />
          <Editable.Input />
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton variant="ghost" size="xs">
                <LuPencilLine />
              </IconButton>
            </Editable.EditTrigger>
            <Editable.CancelTrigger asChild>
              <IconButton variant="outline" size="xs">
                <LuX />
              </IconButton>
            </Editable.CancelTrigger>
            <Editable.SubmitTrigger asChild>
              <IconButton variant="outline" size="xs">
                <LuCheck />
              </IconButton>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.Root>
        </Flex>
      <Footer />
    </>
  )
}
