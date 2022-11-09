import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FaStar, FaUserFriends } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { bookingRoom, checkBooking, getRoom, getRoomReviews } from "../api";
import { IReview, IRoomDetail } from "../types";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";

export default function RoomDetail() {
  const { roomPk } = useParams();
  const { isLoading, data } = useQuery<IRoomDetail>([`rooms`, roomPk], getRoom);
  const { data: reviewsData } = useQuery<IReview[]>(
    [`rooms`, roomPk, `reviews`],
    getRoomReviews
  );
  const [dates, setDates] = useState<Date[]>();
  const { data: checkBookingData, isLoading: isCheckingBooking } = useQuery(
    ["check", roomPk, dates],
    checkBooking,
    {
      cacheTime: 0,
      enabled: dates !== undefined,
    }
  );
  const { register, watch } = useForm();
  const onBookingClick = () => {
    const guests = watch("guests");
    bookingRoom({ dates, roomPk, guests });
  };
  return (
    <Box
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
    >
      <Helmet>
        <title>{data ? data.name : "Loading..."}</title>
      </Helmet>
      <Skeleton w="25%" height={"43px"} isLoaded={!isLoading}>
        <HStack>
          <Heading>{data?.name}</Heading>
          <Link to={`/rooms/${roomPk}/editroom`}>
            {data?.is_owner ? <Button colorScheme={"red"}>Edit</Button> : null}
          </Link>
        </HStack>
      </Skeleton>
      <Grid
        mt={8}
        rounded="xl"
        overflow="hidden"
        gap={3}
        height="60vh"
        templateRows={"1fr 1fr"}
        templateColumns={"repeat(4, 1fr)"}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <GridItem
            colSpan={index === 0 ? 2 : 1}
            rowSpan={index === 0 ? 2 : 1}
            overflow="hidden"
            key={index}
          >
            <Skeleton isLoaded={!isLoading} h="100%" w="100%">
              {data?.photos && data?.photos.length > 0 ? (
                <Image
                  objectFit={"cover"}
                  w="100%"
                  h="100%"
                  src={data?.photos[index].file}
                />
              ) : null}
            </Skeleton>
          </GridItem>
        ))}
      </Grid>
      <Grid gap={60} templateColumns={"2fr 1fr"}>
        <Box>
          <HStack justifyContent={"space-between"} mt={10}>
            <VStack alignItems={"flex-start"}>
              <Skeleton isLoaded={!isLoading} height={"30px"}>
                <Heading fontSize={"2xl"}>
                  House hosted by {data?.owner.name}
                </Heading>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} height={"30px"}>
                <HStack justifyContent={"flex-start"} w="100%">
                  <Text>
                    {data?.toilets} toliet{data?.toilets === 1 ? "" : "s"}
                  </Text>
                  <Text>∙</Text>
                  <Text>
                    {data?.rooms} room{data?.rooms === 1 ? "" : "s"}
                  </Text>
                </HStack>
              </Skeleton>
            </VStack>
            <Avatar
              name={data?.owner.name}
              size={"xl"}
              src={data?.owner.avatar}
            ></Avatar>
          </HStack>
          <Box mt={10}>
            <Heading fontSize={"2xl"}>
              <HStack>
                <FaStar /> <Text>{data?.rating}</Text>
                <Text>•</Text>
                <Text>
                  {reviewsData?.length} review
                  {reviewsData?.length === 1 ? "" : "s"}
                </Text>
              </HStack>
            </Heading>
            <Container mt={16} maxW="container.lg" marginX="none">
              <Grid gap={10} templateColumns={"1fr 1fr"}>
                {reviewsData?.map((review, index) => (
                  <VStack alignItems={"flex-start"} key={index}>
                    <HStack>
                      <Avatar
                        name={review.user.name}
                        src={review.user.avatar}
                        size="md"
                      />
                      <VStack spacing={0} alignItems={"flex-start"}>
                        <Heading fontSize={"md"}>{review.user.name}</Heading>
                        <HStack spacing={1}>
                          <FaStar size="12px" />
                          <Text>{review.rating}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Text>{review.payload}</Text>
                  </VStack>
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
        <Box pt={10}>
          <Calendar
            onChange={setDates}
            prev2Label={null}
            next2Label={null}
            minDetail="month"
            minDate={new Date()}
            maxDate={new Date(Date.now() + 60 * 60 * 24 * 7 * 4 * 6 * 1000)}
            selectRange
          />
          <InputGroup pt={5}>
            <InputLeftAddon children={<FaUserFriends />} />
            <Input
              {...register("guests", { required: true })}
              placeholder="Guests"
            />
          </InputGroup>
          <Button
            disabled={!checkBookingData?.ok}
            isLoading={isCheckingBooking}
            my={5}
            w="100%"
            colorScheme={"red"}
            onClick={onBookingClick}
          >
            Make Booking
          </Button>
          {!isCheckingBooking && !checkBookingData?.ok ? (
            <Text color={"red"}>Can't book on those dates, sorry</Text>
          ) : null}
        </Box>
      </Grid>
    </Box>
  );
}
