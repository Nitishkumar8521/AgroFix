import {
    Button,
    Input,
    Stack,
    FormControl,
    FormLabel,
    useToast
  } from "@chakra-ui/react";
  import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import Loading from "../Feedback/Loading";
  import Error from "../Feedback/Error";
  
  export default function Edit_product() {
    const { productId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading as true because we have to fetch data first
    const [error, setError] = useState(false);
    const toast = useToast();
  
    async function fetchItem() {
      try {
        const res = await fetch(
          `https://agrofix-production.up.railway.app/product/get-product/${productId}`,
          {
            method: "GET",
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        const product = await res.json()
        setData(product.product);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error("Error fetching product:", error.message);
      }
    }
  
    useEffect(() => {
      fetchItem();
    }, []);
  
    async function handleSubmit(e) {
      e.preventDefault();
      try {
        setLoading(true);
        await fetch(
          `https://agrofix-production.up.railway.app/product/update-product/${productId}`,
          {
            method: "PATCH",
            headers: {
              token: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        console.log("Product updated successfully");
        handleToast({ status:'success' })
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error("Error in handleSubmit in Edit_product:", error.message);
      }
    }
  
    function handleChange(e) {
      const { name, value, type } = e.target;
      const formInput = type === "number" ? Number(value) : value;
      setData({ ...data, [name]: formInput });
    }

    function handleToast({ status }) {
      toast({
        title: status === "success" ? "Product updated Successfully." : "Warning!",
        status,
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    }
  
    if (loading) {
      return <Loading />;
    }
  
    if (error) {
      return <Error />;
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
          <FormControl >
            <FormLabel>Enter product name</FormLabel>
            <Input placeholder="product name" name="name" value={data.name} onChange={handleChange}/>
          </FormControl>
          
         
          <FormControl >
            <FormLabel>Enter Price per Unit</FormLabel>
            <NumberInput size="sm" defaultValue={data.pricePerUnit} min={1}>
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
  