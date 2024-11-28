// Importing necessary components from Chakra UI and other libraries
import {
  Image,
  Text,
  Stack,
  Card,
  CardBody,
  Heading,
  Grid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react"; // React hooks
import { Link, useNavigate, useParams } from "react-router-dom"; // Navigation hook for redirecting
import Loading from "../Feedback/Loading";
import Error from "../Feedback/Error";

export default function Order_tracking() {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [status, setStatus] = useState("");
  
  

  // Function to fetch products from the backend
  async function fetchProduct() {
    try {
      setLoading(true);
      const url =
        localStorage.getItem("role") === "buyer"
          ? "https://agrofix-production.up.railway.app/order/get-ownOrder"
          : "https://agrofix-production.up.railway.app/order/get-allOrder";

      let res = await fetch(url, {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      let data = await res.json();
      setStatus(data.placedOrder[0].status);
      setProducts(data.placedOrder[0].orderItems);
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
  }, []);

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
              </Card>
              <Text>{`Order Status: ${status}`}</Text>
            </GridItem>
          ))}
          {localStorage.getItem("role") == "admin" && (
            <Button>Edit Status</Button>
          )}
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
