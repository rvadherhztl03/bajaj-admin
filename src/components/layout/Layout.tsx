import {Flex, Grid, Hide} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import ContentFooter from "./ContentFooter"
import ContentHeader from "./ContentHeader"
import Footer from "./Footer"
import Header from "./Header"
import {useAuth} from "hooks/useAuth"
import SideBarMenu from "../navigation/SideBarMenu"
import {Poppins} from "@next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800", "900"]
})

const Layout = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const auth = useAuth()
  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated)
  }, [auth.isAuthenticated])
  if (!isAuthenticated) {
    return (
      <Flex width="100vw" height="100vh" alignItems="center" justify="center">
        {props.children}
      </Flex>
    )
  }
  return (
    <div className={poppins.className}>
      <Header />
      <Grid as="main" gridTemplateColumns={["auto", "75px auto", "75px auto", "250px auto"]} flexGrow="1">
        <Hide below="sm">
          <SideBarMenu />
        </Hide>
        <Flex flexFlow={"column nowrap"} overflowX="hidden">
          <ContentHeader />
          {props.children}
          <ContentFooter />
        </Flex>
      </Grid>
      <Footer />
    </div>
  )
}

export default Layout
