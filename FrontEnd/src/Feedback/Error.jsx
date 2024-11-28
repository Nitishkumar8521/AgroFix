import { Alert, AlertIcon } from "@chakra-ui/react";
export default function Error(){
    return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10vh", 
            width: "100vw", 
          }}
        >
        <Alert status="error">
          <AlertIcon />
          There was an error processing your request
        </Alert>
        </div>
      );
}