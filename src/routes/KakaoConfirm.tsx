import { Heading, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogIn } from "../api";

export default function KakaoConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const confirmLogin = async () => {
    const x = new URLSearchParams(search);
    const code = x.get("code");
    if (code) {
      console.log(code);
      kakaoLogIn(code);
    }

    /* if (code) {
      const status = await kakaoLogIn(code);
      if (status === 200) {
        toast({
          status: "success",
          title: "Welcome!",
          description: "Happy to have you back!",
        });
        queryClient.refetchQueries(["me"]);
        navigate("/");
      }
    } */
  };
  useEffect(() => {
    confirmLogin();
  });
  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>Processing log in...</Heading>
      <Text>Don't go anywhere.</Text>
      <Spinner size="lg" />
    </VStack>
  );
}
