import {Alert,AlertDescription,AlertIcon,AlertTitle} from '@chakra-ui/react'
export default function AlertUserfound(){
    return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Your browser is outdated!</AlertTitle>
          <AlertDescription>
            Your Chakra experience may be degraded.
          </AlertDescription>
        </Alert>
      );
}