import { mode, Styles } from "@chakra-ui/theme-tools"
import { extendTheme, ThemeConfig } from "@chakra-ui/react"
import foundations from "./foundations"
import { components } from "./components/Index"

const styles: Styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("white", "gray.800")(props),
    },
  }),
}
const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: "dark",
}

const theme = extendTheme({
  ...foundations,
  components,
  styles,
  config,
})

export default theme