import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import SearchIcon from "@mui/icons-material/Search"
import { Box } from "@mui/material"
import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"
import { useEffect, useState, type FC } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { IS_SEARCH_TEXT_CHECKED_STORAGE_KEY } from "~src/utils/storage"

const POP_UP_BUTTON_ID = "plasmo-csui"

export const config: PlasmoCSConfig = {
  matches: ["*://web.whatsapp.com/*"],
  all_frames: true,
  run_at: "document_end"
}

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

const SearchButton: FC<PlasmoCSUIProps> = () => {
  const [isSearchTextChecked] = useStorage<boolean>({
    key: IS_SEARCH_TEXT_CHECKED_STORAGE_KEY,
    instance: new Storage({
      area: "local"
    })
  })

  const [isShowButton, setIsShowButton] = useState<boolean>(false)
  const [mousePosition, setmMousePosition] = useState({
    x: 0,
    y: 0
  })
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    if (!isSearchTextChecked) {
      if (isShowButton) {
        setIsShowButton(false)
      }
      return
    }
    const handleMouseUp = (event: MouseEvent) => {
      const currentSelection = window.getSelection()

      if (
        event.target instanceof HTMLElement &&
        !event.target.outerHTML.includes(POP_UP_BUTTON_ID) &&
        currentSelection.toString().length === 0
      ) {
        setIsShowButton(false)
        return
      }

      setIsShowButton(true)

      setmMousePosition({ x: event.pageX, y: event.pageY })
      setText(currentSelection.toString())
    }
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isSearchTextChecked])

  if (!mousePosition || !isSearchTextChecked) {
    return null
  }

  return (
    <CacheProvider value={styleCache}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}>
        {isSearchTextChecked && isShowButton && (
          <Box
            style={{
              width: 30,
              height: 30,
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              zIndex: 9999,
              borderRadius: "50%",
              top: mousePosition.y + window.scrollY,
              left: mousePosition.x + window.scrollX,
              cursor: "pointer"
            }}
            onClick={() => {
              window.open(`https://www.google.com/search?q=${text}`, "_blank")
            }}>
            <SearchIcon
              sx={{
                color: "white"
              }}
            />
          </Box>
        )}
      </Box>
    </CacheProvider>
  )
}

export default SearchButton
