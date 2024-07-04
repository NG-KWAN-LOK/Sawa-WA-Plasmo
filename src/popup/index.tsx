import { Box, ThemeProvider, useTheme } from "@mui/material"

import { BackgroundImage } from "~src/component/background-image/BackgroundImage"
import { SearchFromText } from "~src/component/search-from-text/SearchFromText"

function IndexPopup() {
  const theme = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: 600,
          p: 2
        }}>
        <BackgroundImage />
        <SearchFromText />
      </Box>
    </ThemeProvider>
  )
}

export default IndexPopup
