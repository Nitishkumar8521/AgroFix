// Importing necessary components from Chakra UI and other libraries
import {
  Image,
  Text,
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
  GridItem,
} from "@chakra-ui/react";
import {  useEffect, useState } from "react"; // React hooks
import { Link } from "react-router-dom"; // Navigation hook for redirecting
import Loading from "../Feedback/Loading";
import Error from "../Feedback/Error";

export default function Cart() {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast();
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to fetch products from the backend
  async function fetchProduct() {
    try {
      setLoading(true);
      const url = `https://agrofix-production.up.railway.app/user/get-cartItem`;
      let res = await fetch(url, {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      let data = await res.json();
      setProducts(data.cart);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }

  // useEffect to fetch products on component mount
  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      fetchProduct();
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  // Calculate the total price whenever products state changes
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const price = products.reduce(
        (sum, ele) => sum + ele.productId.pricePerUnit * ele.quantity,
        0
      );
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [products]);


  async function handleDelete(id) {
    try {
      setLoading(true);
      await fetch(
        `https://agrofix-production.up.railway.app/user/remove-fromCart/${id}`,
        {
          method: "DELETE",
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      fetchProduct();
      handleToast({ status: "success" });
    } catch (error) {
      setLoading(false);
      setError(true);
      handleToast({ status: "error" });
    }
  }

  function handleToast({ status }) {
    toast({
      title: status === "success" ? "Item delete Successfully." : "Warning!",
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
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={6}
          p={4}
        >
          {products.map((product) => (
            <GridItem key={product.productId._id}>
              <Card maxW="sm" boxShadow="dark-lg">
                {/* Product Card */}
                <CardBody>
                  <Image
                    h="150"
                    w="100%"
                    src={product.productId.url}
                    alt={product.productId.name}
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Text>{product.name}</Text>
                    <Text color="blue.600" fontSize="2xl">
                      ₹{product.productId.pricePerUnit}/KG
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
                        handleDelete(product.productId._id);
                      }}
                    >
                      Remove from Cart
                    </Button>
                    <Text fontSize="md">Quantity: {product.quantity}</Text>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </GridItem>
          ))}
          <Button
            variant="ghost"
            colorScheme="blue"
            bg='pink'
          >
            <Link to='/order'>Place order</Link>
          </Button>
        </Grid>
      ) : (
        <Heading as="h4" size="md" textAlign="center" p={6}>
          {localStorage.getItem("role")
            ? "Item not found"
            : "Please Login to see products"}
        </Heading>
      )}

      <Text m="5" border="2px dotted red" as="mark" fontSize="2xl">
        Your total price = ₹{totalPrice}
      </Text>
    </>
  );
}
