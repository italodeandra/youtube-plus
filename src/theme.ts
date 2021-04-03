import "@fontsource/inter/variable-full.css"
import { createTheme } from "react-library"

const theme = createTheme({
  palette: {
    primary: {
      main: "#c00",
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 1.5 * 16
        }
      }
    }
  }
})

export default theme
