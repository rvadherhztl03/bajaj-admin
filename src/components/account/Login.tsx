import {
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Hide,
  HStack,
  Icon,
  Input,
  useColorModeValue,
  VStack
} from "@chakra-ui/react"
import {ChangeEvent, FormEvent, FunctionComponent, useCallback, useMemo, useState} from "react"

import {useAuth} from "hooks/useAuth"
import schraTheme from "theme/theme"
import {HeaderLogo} from "../branding/HeaderLogo"
import {TbEye, TbEyeOff} from "react-icons/tb"

interface OcLoginFormProps {
  title?: string
  onLoggedIn: () => void
}

const OcLoginForm: FunctionComponent<OcLoginFormProps> = ({title = "Sign into your account", onLoggedIn}) => {
  const {Login, isAuthenticated} = useAuth()
  const [isHidden, setIsHidden] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    identifier: "",
    password: "",
    remember: false
  })

  const backgroundImage = useMemo(() => {
    const backgroundImages = new Array(10).fill("").map((_, i) => `/raster/login-background/${i}.jpg`)
    const randomIndex = Math.floor(Math.random() * 10)
    return backgroundImages[randomIndex]
  }, [])

  const loginHeaderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.600")

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
  }

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      try {
        setIsLoading(true)
        e.preventDefault()
        await Login(formValues.identifier, formValues.password, formValues.remember)
        onLoggedIn()
      } finally {
        setIsLoading(false)
      }
    },
    [formValues.identifier, formValues.password, formValues.remember, onLoggedIn, Login]
  )

  return (
    !isAuthenticated && (
      <Grid gridTemplateColumns={["auto", "auto 50vw"]} h={"100%"} w={"100%"} overflowX={"hidden"}>
        <Hide below="lg">
          <Box
            bgImg={`url(${"https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/pulsar-k-2024/hero-banner/web-banner.webp"})`}
            bgSize={"cover"}
            bgRepeat={"no-repeat"}
            bgColor={"blackAlpha.700"}
            bgBlendMode={"overlay"}
            bgPosition={"center"}
          />
        </Hide>
        <Flex
          flexDirection={"column"}
          alignItems={["center", "flex-start"]}
          justifyContent="center"
          borderLeft={`.5px solid ${schraTheme.colors.blackAlpha[300]}`}
        >
          <chakra.form pl={[0, 12]} name="ocLoginForm" onSubmit={handleSubmit}>
            <VStack width="full" alignItems={"flex-start"} gap={4}>
              <HeaderLogo maxW={250} w="full" />
              <Heading as="h1" fontSize={"4xl"} fontWeight={"thin"} color={loginHeaderColor}>
                {title}
              </Heading>
              {/* TODO Get Errors on Login */}
              {/* {error && (
              <Alert status="error" variant="solid">
                <AlertIcon />
                {error.message}{" "}
              </Alert>
            )} */}
              <FormControl display={"flex"} flexFlow={"column nowrap"} gap={4} minW={"sm"}>
                <Box>
                  <FormLabel htmlFor="identifier">Username</FormLabel>
                  <Input
                    type="text"
                    variant="filled"
                    id="identifier"
                    name="identifier"
                    placeholder="Enter username"
                    value={formValues.identifier}
                    onChange={handleInputChange("identifier")}
                    required
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    variant="filled"
                    type={!isHidden ? "password" : "text"}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formValues.password}
                    onChange={handleInputChange("password")}
                    required
                  />
                  <Icon
                    as={!isHidden ? TbEyeOff : TbEye}
                    strokeWidth="1.25"
                    fontSize="1.5em"
                    position={"absolute"}
                    top={"49%"}
                    right={"2%"}
                    onClick={() => {
                      setIsHidden(!isHidden)
                    }}
                    cursor={"pointer"}
                    aria-label={!isHidden ? "shop password" : "hide password"}
                  />
                </Box>
                <Box>
                  <HStack>
                    <Checkbox
                      id="remember"
                      name="remember"
                      colorScheme={"primary"}
                      checked={formValues.remember}
                      onChange={handleCheckboxChange("remember")}
                      size="lg"
                      mx={1}
                      py={2}
                    />
                    <FormLabel htmlFor="remember" fontSize="sm">
                      Keep me logged in
                    </FormLabel>
                  </HStack>
                </Box>
                <Button variant="solid" disabled={isLoading} type="submit" width="full" onClick={handleSubmit}>
                  Sign in
                </Button>
              </FormControl>
            </VStack>
          </chakra.form>
        </Flex>
      </Grid>
    )
  )
}

export default OcLoginForm
