import "@fontsource/inter/variable-full.css"
import createTheme from "@italodeandra/pijama/styles/createTheme"
import { darken, lighten } from "@material-ui/core/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#c00",
      dark: darken("#c00", 0.1),
      light: lighten("#c00", 0.1),
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 1.5 * 16,
        },
      },
    },
  },
})

export default theme
