import { Flex, Box, Image, Link, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Product from "../Pages/Product";

function Title() {
    const themeArray = [
        'https://kaybeebio.com/wp-content/uploads/2023/05/why-the-use-of-bio-pesticides-is-the-best-step-forward-in-agriculture-in-2022.jpg',
        'https://bizimages.withfloats.com/actual/5a962ed3bcda0807146eaf22.jpg',
        'https://images.indianexpress.com/2022/07/urea-1.jpg',
    ];
    
    // State to manage the current index of the rotating image
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Set an interval to rotate images every 3 seconds
        const interval = setInterval(() => {         
            setCurrentImageIndex(currentIndex => {
                // Rotate to the next image or loop back to the first image
                if (currentIndex === 2) {
                    return 0;
                } else {
                    return (currentIndex + 1);
                }
            });          
        }, 3000); 
        
        // Clear the interval when the component is unmounted
        return () => clearInterval(interval); 
    }, []);

    return (
        <>
            <Flex>
                <Box w='100%' h='300px'>
                    <Link href="">
                        <Image w='100%' h='100%' src={themeArray[currentImageIndex]} />
                    </Link>
                </Box>
            </Flex>
            <Product />
            
        </>
    );
}

export default Title;
