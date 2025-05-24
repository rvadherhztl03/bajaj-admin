import {Box, Text} from "@chakra-ui/react"
import Image from "next/image"
import {images} from "utils/constants"

const Loader = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
      <Image src={images?.loaderGIF} height={100} width={300} alt="loading data" aria-busy={true} />
      <Text color={"black"}>Loading....</Text>
    </Box>
  )
}

export default Loader
