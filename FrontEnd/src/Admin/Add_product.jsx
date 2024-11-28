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

export default function Add_Product() {
  const [data, setData] = useState({name:"", photo:null, pricePerUnit:1 })
  const [loading, setLoading ] = useState(false)
  const [error, setError ] = useState(false)
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("photo", data.photo); 
      formData.append("pricePerUnit", data.pricePerUnit);
      setLoading(true)

      const response = await fetch('https://agrofix-production.up.railway.app/product/add-product', {
        method: "POST",
        headers: {
          token: localStorage.getItem("token"), 
        },
        body: formData, //because payload is not only JSON format (i.e req.file is also present for image) 
        //if all payload is in JSON format then we can use (body: JSON.stringify(payload))       
      });
  
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      handleToast({ status:'success' })
      console.log("Product added successfully");
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
      title: status === "success" ? "Product Add Successfully." : "Warning!",
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
          <FormLabel>Enter product name</FormLabel>
          <Input placeholder="product name" name="name" value={data.name} onChange={handleChange}/>
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Upload image</FormLabel>
          <input type="file" name='photo' onChange={handleChange}/>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Enter Price per Unit</FormLabel>
          <NumberInput size="sm" defaultValue={15} min={1}>
            <NumberInputField type='number' focusBorderColor="red.200" name='pricePerUnit' value={data.pricePerUnit} onChange={handleChange} />
            <NumberInputStepper>
              <NumberIncrementStepper
                bg="green.200"
                _active={{ bg: "green.300" }}
                children="+"
              />
              <NumberDecrementStepper
                bg="pink.200"
                _active={{ bg: "pink.300" }}
                children="-"
              />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        
        <Button mt={4} colorScheme="teal" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
