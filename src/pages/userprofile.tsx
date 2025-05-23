import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
  VStack
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import Login from "../components/account/Login"
import {useRouter} from "hooks/useRouter"
import {AdminUsers, Tokens, User, Users} from "ordercloud-javascript-sdk"
import {parseJwt} from "utils"
import {useCallback, useEffect, useState} from "react"
import {useFormik} from "formik"
import * as yup from "yup"
import {useSuccessToast} from "hooks/useToast"
import {TbPencil} from "react-icons/tb"

const UserProfile = () => {
  const [useDetails, setUseDetails] = useState<User>()
  const {push} = useRouter()
  const handleOnLoggedIn = () => {
    push("/")
  }

  const [loading, setLoading] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const accessToken = Tokens?.GetAccessToken()
  const userName = parseJwt(accessToken)?.usr
  const successToast = useSuccessToast()
  const [isDataFetched, setIsDataFetched] = useState(false)
  const {isReady} = useRouter()

  //Validation schema for formik
  const validationSchema = yup.object({
    shopName: yup.string().required("Required field"),
    entity: yup.string().required("Required field"),
    value: yup.string().required("Required field")
  })

  const formIk = useFormik({
    //set the initial values
    initialErrors: {firstName: ""},
    initialValues: {
      firstName: useDetails?.FirstName,
      lastName: useDetails?.LastName,
      phone: useDetails?.Phone || "-"
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    //submitting the Pet details
    onSubmit: async (values) => {
      setLoading(true)
      const data = {
        FirstName: values?.firstName,
        LastName: values?.lastName,
        Phone: values?.phone
      }
      const res = await AdminUsers?.Patch(useDetails?.ID, {...data})
      if (res) {
        successToast({
          description: "Data Updated successfully."
        })
        setLoading(false)
      }
    }
  })

  const getUserDetails = useCallback(async () => {
    try {
      setLoading(true)
      if (!useDetails) {
        const res = await AdminUsers?.List({filters: {Username: userName}})
        res && setIsDataFetched(true)
        const data = res?.Items?.[0]
        setUseDetails(data)
        formIk?.setValues({
          firstName: data?.FirstName || "",
          lastName: data?.LastName || "",
          phone: data?.Phone || ""
        })
      }
    } catch (error) {
      console.error("Failed to fetch user details", error)
    } finally {
      setLoading(false)
    }
  }, [useDetails])

  //getting user details
  useEffect(() => {
    if (isReady) {
      getUserDetails()
    }
  }, [isReady, getUserDetails])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }

  return (
    <Flex h={"100vh"}>
      <NextSeo title="User Profile" />
      <Login onLoggedIn={handleOnLoggedIn} />
      {useDetails ? (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <form onSubmit={formIk?.handleSubmit}>
            <Card display="flex">
              <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between" fontWeight={"bold"}>
                User Profile
              </CardHeader>
              <CardBody
                display="flex"
                flexWrap={{base: "wrap", lg: "nowrap"}}
                alignItems={"flex-start"}
                justifyContent="space-between"
                gap={6}
              >
                <Grid gap={4} w="100%" gridTemplateColumns={{lg: "1fr 1fr"}}>
                  <GridItem alignItems={"start"} colSpan={2} display={"flex"} justifyContent={"space-between"}>
                    <Badge colorScheme="green" color={"black"}>
                      {useDetails?.Username}{" "}
                    </Badge>
                    <Flex
                      fontWeight={"semibold"}
                      onClick={() => {
                        formIk?.resetForm()
                        setIsEditable(!isEditable)
                      }}
                    >
                      {!isEditable ? (
                        <>
                          Edit&nbsp;
                          <Icon cursor={"pointer"} as={TbPencil} strokeWidth="1.25" fontSize="1.5em" color={"black"} />
                        </>
                      ) : (
                        <Button colorScheme="red" type="reset">
                          Cancel
                        </Button>
                      )}
                    </Flex>
                  </GridItem>
                  <VStack alignItems={"start"}>
                    <label htmlFor="firstName" style={{fontWeight: "bold"}}>
                      First Name:{" "}
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formIk?.values?.firstName}
                      onChange={formIk.handleChange}
                      readOnly={!isEditable}
                    />
                  </VStack>
                  <VStack alignItems={"start"}>
                    <label htmlFor="lastName" style={{fontWeight: "bold"}}>
                      Last Name:{" "}
                    </label>
                    <Input
                      id="lastName"
                      value={formIk?.values?.lastName}
                      onChange={formIk.handleChange}
                      readOnly={!isEditable}
                    />
                  </VStack>
                  <VStack alignItems={"start"}>
                    <label htmlFor="email" style={{fontWeight: "bold"}}>
                      Email:{" "}
                    </label>
                    <Input id="email" value={useDetails?.Email} onChange={formIk.handleChange} readOnly={true} />
                  </VStack>
                  <VStack alignItems={"start"}>
                    <label htmlFor="phone" style={{fontWeight: "bold"}}>
                      Phone:{" "}
                    </label>
                    <Input
                      id="phone"
                      value={formIk?.values?.phone}
                      onChange={formIk.handleChange}
                      readOnly={!isEditable}
                    />
                  </VStack>
                  {isEditable && (
                    <Button colorScheme="green" width={"fit-content"} type="submit">
                      Edit Info
                    </Button>
                  )}
                </Grid>
              </CardBody>
            </Card>
          </form>
        </Container>
      ) : (
        ""
      )}
    </Flex>
  )
}

export default UserProfile
