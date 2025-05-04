import { useAuth } from "../components/AuthContext";
import { useState, useEffect } from "react";
import { Spinner, Text, Flex, Heading, Fieldset, Field, Button, Input, Stack, Editable, IconButton, Alert } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import Header from "../components/Header";
import Footer from "../components/Footer";
import User from "../data/User";
import { useNavigate } from "react-router";


export default function Mypage() {
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user, isLoading, setUser } = useAuth();
  const [errorText, setErrorText] = useState("");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  //get login user data
  useEffect(() => {
    if (user) {
      setNewName(user.username);
      setNewEmail(user.email);
    }
  }, [user]);

  //fetch users data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        setErrorText("Failed to fetch user data");
        console.error("Error fetching user data:", error);
        return [];
      }
    }
    const fetchUserData = async () => {
      const data = await getUserData();
      setUsersData(data);
    }  
    fetchUserData();
  }, [])
       
       
  //loading while gettgin login user data
  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const isValidName = (name: string) => {
    //check the name format
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setErrorText("Invalid name format");
      return false;
    }
    return true;
  }

  const isValidEmail = (email: string) => {
    //check the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorText("Invalid email format");
      return false;
    }
    //check if the email is already registered, unless the email is the same as the current user's email
    if (usersData.some((users) => users.email === email) && email !== user.email) {
      setErrorText("Email already registered");
      return false;
    }
    return true;
  }

  const isValidPassword = (password: string) => {
    //check the password format
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    //if password is empty, it means the user doesn't want to change the password
    if (!password)
      return true;
    if (!passwordRegex.test(password)) {
      setErrorText("Invalid password format");
      return false;
    }
    return true;
  }

  const handleUpdate = async () => {
    if (!isValidName(newName) || !isValidPassword(newPassword) || !isValidEmail(newEmail)) {
      setShowAlert(true);
      return;
    }

    const diff: Partial<User> = {};
    if (newName !== user.username) {
      diff.username = newName;
    }
    if (newEmail !== user.email) {
      diff.email = newEmail;
    }
    if (newPassword) {
      diff.password = newPassword;
    }
    if (Object.keys(diff).length === 0) {
      setErrorText("No changes made");
      setShowAlert(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/update", {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diff),
      });
      if (!response.ok) {
        setErrorText("Failed to update user data, bad response");
        setShowAlert(true);
        return;
      }
      const data = await response.json();
      setUser(data.user);
      // navigate("/search");
      navigate("/success-user-update");
    } catch (error) {
      setErrorText("Failed to update user data");
      setShowAlert(true);
      console.error("Error updating user data:", error);
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/logout", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setErrorText("Failed to logout");
        setShowAlert(true);
        return;
      }
      setUser(null);
      navigate("/");
    } catch (error) {
      setErrorText("Failed to logout");
      setShowAlert(true);
    }
  }
  
  return (
    <>
      <Header />
      <Heading size="4xl" w="50%" margin="0 auto" mt="50px" textAlign="center">My page</Heading>
      <Flex flexDirection="column" alignItems="center" mt="100px"  width="100%" height="90vh">
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
        <Editable.Root value={newEmail} onValueChange={(e) => setNewEmail(e.value)} border="1px solid black" w="md" borderRadius="3px" mb="20px">
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
        <Text fontSize="2xl" mb="20px">Password</Text>
        <Editable.Root defaultValue="new password" onValueChange={(e) => setNewPassword(e.value)} border="1px solid black" w="md" borderRadius="3px" mb="20px">
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
        {showAlert && (
          <Alert.Root>
           <Alert.Indicator />
           <Alert.Content>
             <Alert.Title>Failed to Login</Alert.Title>
             <Alert.Description>{errorText}</Alert.Description>
           </Alert.Content>
          </Alert.Root>
        )}
        <Flex flexDir="row">
          <Button mr="20px" bg="blue.500" color="white" onClick={handleUpdate}>Update</Button>
          <Button ml="20px" bg="red.500" color="white" onClick={handleLogout}>Logout</Button>
        </Flex>
        </Flex>
      <Footer />
    </>
  )
}
