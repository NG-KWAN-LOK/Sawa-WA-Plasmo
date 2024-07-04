import { Box, Checkbox, Typography } from "@mui/material"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { IS_SEARCH_TEXT_CHECKED_STORAGE_KEY } from "~src/utils/storage"

export const SearchFromText = () => {
  const [isSearchTextChecked, setIsSearchTextChecked] = useStorage<boolean>(
    {
      key: IS_SEARCH_TEXT_CHECKED_STORAGE_KEY,
      instance: new Storage({
        area: "local"
      })
    },
    true
  )

  const handleSearchTextCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsSearchTextChecked(event.target.checked)
  }
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center"
        }}>
        <Typography
          variant="body1"
          sx={{
            width: 230
          }}>
          Search Text:
        </Typography>
        <Checkbox
          checked={isSearchTextChecked}
          onChange={handleSearchTextCheckboxChange}
        />
      </Box>
    </Box>
  )
}
