import { Flex, Fieldset, Field, Input, Stack, Button, Alert } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import User from "../data/User";
import { useAuth } from "../components/AuthContext";

export default function UserCreate() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [errorText, setErrorText] = useState("");
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
        console.error("Error fetching user data:", error);
        return [];
      }
    }
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    }
    fetchUserData();
  }, []);

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
    //check if the email is already registered
    if (userData.some((user) => user.email === email)) {
      setErrorText("Email already registered");
      return false;
    }
    return true;
  }

  const isValidPassword = (password: string) => {
    //check the password format
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorText("Invalid password format");
      return false;
    }
    return true;
  }

  const handleRegister = async () => {
    if (!isValidName(userName) || !isValidPassword(userPassword) || !isValidEmail(userEmail)) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    const newUser: User = {
      username: userName,
      email: userEmail,
      password: userPassword,
    }
    try {
      const response = await fetch("http://localhost:3000/users/register", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        setErrorText("Failed to create user");
        setShowAlert(true);
        return;
      }
      const data = await response.json();
      setUser(data.user);
      navigate("/success-user-create");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  return (
    <>
      <Header />
      <Flex justify="center" h="100vh" mt="300px">
        <Fieldset.Root w="md">
          <Stack >
            <Fieldset.Legend fontSize="xl" fontFamily="">Register</Fieldset.Legend>
            <Fieldset.HelperText>Fill in the details to create an account</Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input name="name" onChange={(e) => setUserName(e.target.value)}/>
            </Field.Root>
            <Field.Root>
              <Field.Label>email</Field.Label>
              <Input name="email" type="email" onChange={(e) => setUserEmail(e.target.value)}/>
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
               <Alert.Title>Failed to create account</Alert.Title>
               <Alert.Description>{errorText}</Alert.Description>
             </Alert.Content>
            </Alert.Root>
          )}
          <Button type="submit" color="white" bg="blue.500" mt="4" onClick={handleRegister}>Register</Button>
        </Fieldset.Root>
      </Flex>
      <Footer />
    </>
  )
}
