import { Input, Button, useToast } from "@chakra-ui/react";

import { Stack, FormControl, FormLabel } from "@chakra-ui/react";

import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContextProvider";
import Loading from "../Feedback/Loading";

function Login() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Context for authentication state
  const { toggle } = useContext(AuthContext);

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
        "https://agrofix-production.up.railway.app/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const data1 = await response.json();
      if (data1.token) {
        localStorage.setItem("token", data1.token);
        localStorage.setItem("userId", data1.loggedUser.userId);
        localStorage.setItem("role", data1.loggedUser.role);
        localStorage.setItem("email", data1.loggedUser.name);
        setLoading(false);
        handleToast({ status: "success" });
        toggle();
        navigate("/");
      } else {
        setLoading(false);
        handleToast({ status: "error" });
      }
    } catch (error) {
      console.log("catch");
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
    navigate("/sign");
  }

  // Function to handle toast notifications
  function handleToast({ status }) {
    toast({
      title: status === "success" ? "Login Successfully." : "Warning!",
      description:
        status === "success" ? "Welcome Back." : "Please Provide valid Email",
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
            <FormLabel>Email</FormLabel>
            <Input
              ref={loginRef}
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
              Having no account?  <span style={{ color: "red" }}>{" "}Sign Up</span>
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default Login;
