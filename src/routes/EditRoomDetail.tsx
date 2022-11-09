import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import {
  getCategories,
  getAmenities,
  getRoom,
  editRoom,
  IUploadRoomVariables,
} from "../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICategory, IAmenity, IRoomDetail } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { FaBed, FaMoneyBill, FaToilet } from "react-icons/fa";

export default function EditRoomDetail() {
  const { roomPk } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IUploadRoomVariables>();
  const mutation = useMutation(editRoom, {
    onSuccess: (data: IRoomDetail) => {
      console.log(data);
      navigate(`/rooms/${data.id}`);
    },
  });
  const { data: room } = useQuery(["rooms", roomPk], getRoom);
  const { data: categories } = useQuery<ICategory[]>(
    ["category"],
    getCategories
  );
  const { data: amenities } = useQuery<IAmenity[]>(["amenity"], getAmenities);
  useHostOnlyPage();
  const onSubmit = (data: any) => {
    mutation.mutate({ data, roomPk });
  };

  return (
    <ProtectedPage>
      <Box
        pb={40}
        mt={10}
        px={{
          base: 10,
          lg: 40,
        }}
      >
        <Container>
          <Heading textAlign={"center"}>Edit Room</Heading>
          <VStack
            as="form"
            spacing={10}
            mt={5}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                {...register("name", { required: true })}
                required
                type="text"
                defaultValue={room.name}
              ></Input>
              <FormHelperText>Write the name of your room</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                {...register("country", { required: true })}
                required
                type="text"
                defaultValue={room.country}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                {...register("city", { required: true })}
                required
                type="text"
                defaultValue={room.city}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                {...register("address", { required: true })}
                required
                type="text"
                defaultValue={room.address}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<FaMoneyBill />} />
                <Input
                  {...register("price", { required: true })}
                  required
                  type="number"
                  min={0}
                  defaultValue={room.price}
                ></Input>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Rooms</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<FaBed />} />
                <Input
                  {...register("rooms", { required: true })}
                  required
                  type="number"
                  defaultValue={room.rooms}
                ></Input>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Toilets</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<FaToilet />} />
                <Input
                  {...register("toilets", { required: true })}
                  required
                  type="number"
                  defaultValue={room.toilets}
                ></Input>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register("description", { required: true })}
                defaultValue={room.description}
              />
            </FormControl>
            <FormControl>
              <Checkbox
                {...register("pet_friendly")}
                defaultChecked={room.pet_friendly}
              >
                Pet friendly?
              </Checkbox>
            </FormControl>
            <FormControl>
              <FormLabel>Kind of room</FormLabel>
              <Select
                {...register("kind", { required: true })}
                defaultValue={room.kind}
              >
                <option value="entire_place">Entire Place</option>
                <option value="private_room">Private Room</option>
                <option value="shared_room">Shared Room</option>
              </Select>
              <FormHelperText>
                What kind of room are you renting?
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                {...register("category", { required: true })}
                defaultValue={room.category}
              >
                {categories?.map((category) => (
                  <option key={category.pk} value={category.pk}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <FormHelperText>
                What category describes your room?
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Amenities</FormLabel>
              <Grid templateColumns={"1fr 1fr"} gap={5}>
                {amenities?.map((amenity) => (
                  <Box key={amenity.pk}>
                    <Checkbox
                      value={amenity.pk}
                      {...register("amenities", { required: true })}
                    >
                      {amenity.name}
                    </Checkbox>
                    <FormHelperText>{amenity.description}</FormHelperText>
                  </Box>
                ))}
              </Grid>
            </FormControl>
            {mutation.isError ? <Text>Something went wrong</Text> : null}
            <Button
              type="submit"
              isLoading={mutation.isLoading}
              colorScheme={"red"}
              size="md"
              w="100%"
            >
              Edit Room
            </Button>
          </VStack>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
