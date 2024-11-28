import { useToast } from "@chakra-ui/react";

function useHandleToast() {
  const toast = useToast();

  function handleToast({status}) {
    toast({
      title: status === "success" ? "Account created." : "Warning!",
      description:
        status === "success"
          ? "We've created your account for you."
          : "Please provide a valid Email.",
      status,
      duration: 5000,
      isClosable: true,
      position:'top'
    });
  }

  return handleToast;
}

export { useHandleToast }
