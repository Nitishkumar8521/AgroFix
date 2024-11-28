import { Input, Button, useToast } from "@chakra-ui/react";

import { Stack, FormControl, FormLabel } from "@chakra-ui/react";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Feedback/Loading";

function Login() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({name: "", email: "", password: "" });

  // Hook to navigate programmatically
  const navigate = useNavigate();


  // Reference for the input field
  const loginRef = useRef(null);

  // Hook for showing toast notifications
  const toast = useToast();

  function handleChange(e) {
    const { name, value, type } = e.target;
    const formInput = type === "number" ? Number(value) : value;
    setData({ ...data, [name]: formInput });
  }

  // Login function to verify user and handle navigation
  async function login(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        "https://agrofix-production.up.railway.app/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
        console.log(await response.json());
        setLoading(false);
        handleToast({ status: "success" });
        navigate("/login");
    } catch (error) {
      setLoading(false);
      handleToast({ status: "error" });
    }
  }

  // Focus on the input field when the component mounts
  useEffect(() => {
    loginRef.current.focus();
  }, []);

  // Navigate to the sign-up page
  function Sign_Up() {
    navigate("/login");
  }

  // Function to handle toast notifications
  function handleToast({ status }) {
    toast({
      title: status === "success" ? "Register Successfully." : "Warning!",
      description:
        status === "success" ? "Welcome to AgroFix." : "Please Provide valid Email",
      status,
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={login}>
        <Stack
          margin="auto"
          gap="4"
          align="flex-start"
          maxW="sm"
          boxShadow="dark-lg"
          p="6"
          rounded="md"
          bg="white"
        >
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              ref={loginRef}
              placeholder="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit">
            Submit
          </Button>
          <Button colorScheme="whiteAlpha" onClick={Sign_Up} color='black'>
              Having account?  <span style={{ color: "red" }}>{" "}Login</span>
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default Login;
