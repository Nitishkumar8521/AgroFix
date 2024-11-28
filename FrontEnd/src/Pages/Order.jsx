import { Button, Input, Stack, FormControl, FormLabel,  useToast } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper, 
} from "@chakra-ui/react";
import { useState } from "react";
import Loading from "../Feedback/Loading";
import Error from "../Feedback/Error";

export default function Order() {
  const [data, setData] = useState({deliveryAddress:"",  contactInfo:"" })
  const [loading, setLoading ] = useState(false)
  const [error, setError ] = useState(false)
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true)

      const response = await fetch('https://agrofix-production.up.railway.app/order/create-order', {
        method: "POST",
        headers: {
          token: localStorage.getItem("token"), 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)       
      });
  
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      handleToast({ status:'success' })
      console.log("Order placed successfully");
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(true)
      console.error("Error in handleSubmit:", error.message);
    }
  }
  

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    const formInput = type === "file" ? files[0] : type === "number" ? Number(value) : value; 
    setData({ ...data, [name]: formInput });
  }

  function handleToast({ status }) {
    toast({
      title: status === "success" ? "Order placed Successfully." : "Warning!",
      status,
      duration: 1000,
      isClosable: true,
      position: "top",
    });
  }

  if(loading){
    return <Loading />
  }
  
  if(error){
    return <Error />
  }
  

  return (
    <form onSubmit={handleSubmit}>
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
          <FormLabel>Enter Address</FormLabel>
          <Input placeholder="Address" name="deliveryAddress" value={data.deliveryAddress} onChange={handleChange}/>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Enter contactInfo</FormLabel>
          <Input placeholder="contact" name="contactInfo" value={data.contactInfo} onChange={handleChange}/>
        </FormControl>      
        
        <Button mt={4} colorScheme="teal" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
