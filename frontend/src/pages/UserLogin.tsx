import { Flex, Fieldset, Field, Input, Stack, Button, Alert, Text, Link } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import User from "../data/User";
import { useAuth } from "../components/AuthContext";

export default function UserLogin() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [usersData, setUserData] = useState<any[]>([]);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        setErrorText("Failed to fetch user data");
        return [];
      }
    }
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    }
    fetchUserData();
  }, []);

  const isValidEmail = (email: string) => {
    //check the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorText("Invalid email format");
      return false;
    }
    //check if the email is exists in user data
    const userData = usersData.filter((user) => user.email === email);
    if (userData.length === 0) {
      setErrorText("User not found");
      return false;
    }
    return true;
  }

  const isValidPassword = (password: string) => {
    //check the correct password compared to the registered user
    if (!password) {
      setErrorText("Password cannot be empty");
      return false;
    }
    return true;
  }

  const handleRegister = async () => {
    if (!isValidEmail(userEmail) || !isValidPassword(userPassword)) {
      setShowAlert(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });
      if (!response.ok) {
        setErrorText("Failed to login, check your password");
        setShowAlert(true);
      }
      const data = await response.json();
      setUser(data.user);
      navigate("/search");
    } catch (error) {
      setErrorText("Failed to login");
      setShowAlert(true);
    }
  }

  return (
    <>
      <Header />
      <Flex justify="center" h="100vh" mt="300px">
        <Fieldset.Root w="md">
          <Stack >
            <Fieldset.Legend fontSize="xl" fontFamily="">Login</Fieldset.Legend>
            <Fieldset.HelperText>Fill email and password.</Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>email</Field.Label>
              <Input name="email" onChange={(e) => setUserEmail(e.target.value)}/>
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <PasswordInput onChange={(e) => setUserPassword(e.target.value)}/>
            </Field.Root>
          </Fieldset.Content>
          {showAlert && (
            <Alert.Root>
             <Alert.Indicator />
             <Alert.Content>
               <Alert.Title>Failed to Login</Alert.Title>
               <Alert.Description>{errorText}</Alert.Description>
             </Alert.Content>
            </Alert.Root>
          )}
          <Text>If you don't have an account, <Link href="/register" color="blue.500">Create your account!!</Link> </Text>
          <Button type="submit" color="white" bg="blue.500" mt="4" onClick={handleRegister}>Login</Button>
        </Fieldset.Root>
      </Flex>
      <Footer />
    </>
  )
}
