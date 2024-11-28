import {
    Image,
    Text,
    Box,
    Button,
    Stack,
    Card,
    CardBody,
    CardFooter,
    Divider,
    ButtonGroup,
    useToast,
    Heading,
    Grid,
    GridItem
  } from "@chakra-ui/react";
  import { StarIcon } from "@chakra-ui/icons"; // Importing the Star icon for ratings
  import { useContext, useEffect, useState } from "react"; // React hooks
  import { AuthContext } from "../Contexts/AuthContextProvider"; // Auth context for user authentication
  import { Link, useNavigate, useParams } from "react-router-dom"; // Navigation hook for redirecting
  import Loading from "../Feedback/Loading";
  import Error from "../Feedback/Error";
  
  // Diabetes_Card functional component
  export default function Product() {
    // State variables
    const [products, setProducts] = useState([]); // State to hold product data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(false); // Error state
    const { auth } = useContext(AuthContext); // Accessing authentication status from AuthContext
    const navigate = useNavigate(); // Hook for navigation
    const toast = useToast();
  
  
    // Function to fetch products from the backend
    async function fetchProduct() {
      try {
        setLoading(true); // Setting loading state to true
        const url = `https://agrofix-production.up.railway.app/product/get-product`;
        let res = await fetch(url, {
          method: "GET",
          headers: {
            token: localStorage.getItem("token"),
          },
        }); // Fetching product data from API
        let data = await res.json();
        setProducts(data.product);
        setLoading(false);
      } catch (error) {
        setLoading(false); // In case of error, stop loading
        setError(true); // Set error state to true
      }
    }
  
    // useEffect to fetch products on component mount
    useEffect(() => {
      let isCancelled = false; // Variable to check if component is unmounted
      if (!isCancelled) {
        fetchProduct(); // Fetching products if not cancelled
      }
      return () => {
        isCancelled = true; // Cleanup to prevent memory leaks
      };
    }, []);
  
    // --------------------------ADD TO CART FUNCTIONALITY------------------------
  
    // Function to handle adding products to cart
    async function handleAddtocart(id) {
      if (!auth) {
        // If user is not authenticated
        navigate("/login"); // Redirect to login page
      } else {
        await fetch(
          `https://agrofix-production.up.railway.app/user/add-toCart/${id}`,
          {
            method: "PATCH",
            headers: {
              token: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body:JSON.stringify({quantity:1})
          }
        );
        handleToast({ status: "success" });
      }
    }
  
    async function handleDelete(id) {
      try {
        setLoading(true);
        await fetch(
          `https://agrofix-production.up.railway.app/product/delete-product/${id}`,
          {
            method: "DELETE",
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        setLoading(false);
        fetchProduct();
        handleToast1({ status: "success" });
      } catch (error) {
        setLoading(false);
        setError(true);
        handleToast({ status: "error" });
      }
    }
  
    function handleToast({ status }) {
      toast({
        title: status === "success" ? "Item Add Successfully." : "Warning!",
        status,
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    }

    function handleToast1({ status }) {
      toast({
        title: status === "success" ? "Item deleted Successfully." : "Warning!",
        status,
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    }
  
    // If loading, display a spinner
    if (loading) {
      return <Loading />;
    }
  
    // If there's an error, display an alert
    if (error) {
      return <Error />;
    }
  
    // Rendering the products with a Card layout
    return (
      <>
        {Array.isArray(products) && products.length > 0 ? (
          <Grid 
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} 
            gap={6} 
            p={4}
          >
            {products.map((product) => (
              <GridItem key={product._id}>
                <Card maxW="sm" boxShadow="dark-lg">
                  {/* Product Card */}
                  <CardBody>
                    <Image
                      h="150"
                      w="100%"
                      src={product.url}
                      alt={product.name}
                      borderRadius="lg"
                    />
                    <Stack mt="6" spacing="3">
                      <Text>{product.name}</Text>
                      <Text color="blue.600" fontSize="2xl">
                        ₹{product.pricePerUnit}/KG
                      </Text>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <ButtonGroup spacing="1">
                      <Button
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => {
                          localStorage.getItem("role") === "admin"
                            ? handleDelete(product._id)
                            : handleAddtocart(product._id);
                        }}
                      >
                        {localStorage.getItem("role") === "admin"
                          ? "Delete Item"
                          : "Add to Cart"}
                      </Button>
                      {localStorage.getItem("role") === "admin" && (
                        <Button variant="ghost" colorScheme="blue">
                          <Link to={`/edit-product/${product._id}`}>Edit Item</Link>
                        </Button>
                      )}
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Heading as="h4" size="md" textAlign="center" p={6}>
            {localStorage.getItem("role")
              ? "Item not found"
              : "Please Login to see products"}
          </Heading>
        )}
      </>
    );
  }
  