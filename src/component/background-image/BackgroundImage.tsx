import { DarkMode, LightMode, ZoomIn, ZoomOut } from "@mui/icons-material"
import { Box, Button, Slider, Stack, Typography } from "@mui/material"
import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import {
  BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY,
  BACKGROUND_IMAGE_SIZE_STORAGE_KEY,
  BACKGROUND_IMAGE_URL_STORAGE_KEY
} from "~src/utils/storage"

export const config: PlasmoCSConfig = {
  matches: ["*://web.whatsapp.com/*"],
  run_at: "document_end"
}

export const BackgroundImage = () => {
  const [lightValue, setLightValue] = useStorage<number>(
    {
      key: BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY,
      instance: new Storage({
        area: "local"
      })
    },
    1
  )
  const [sizeValue, setSizeValue] = useStorage<number>(
    {
      key: BACKGROUND_IMAGE_SIZE_STORAGE_KEY,
      instance: new Storage({
        area: "local"
      })
    },
    100
  )
  const [imageUrl, setImageUrl] = useStorage<string | null>(
    {
      key: BACKGROUND_IMAGE_URL_STORAGE_KEY,
      instance: new Storage({
        area: "local"
      })
    },
    null
  )

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (file.size > 1024 * 1024) {
          alert("Image size should be less than 1MB")
          return
        }
        if (event.target) {
          setImageUrl(event.target.result as string)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImageClick = () => {
    setImageUrl(null)
  }

  const handleLightValueChange = (
    _event: unknown,
    value: number | number[]
  ) => {
    setLightValue(value as number)
  }

  const handleImageSizeValueChange = (
    _event: unknown,
    value: number | number[]
  ) => {
    setSizeValue(value as number)
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
          Change Background Image:
        </Typography>
        <Box
          sx={{
            display: "flex"
          }}>
          <Button size="small" onClick={handleRemoveImageClick}>
            Remove Image
          </Button>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Box>
      </Box>
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
          Background Image Brightness:
        </Typography>
        <Box sx={{ width: 300 }}>
          <Stack spacing={2} direction="row" sx={{ mr: 1 }} alignItems="center">
            <DarkMode />
            <Slider
              max={1}
              min={0.01}
              step={0.01}
              value={lightValue}
              onChange={handleLightValueChange}
            />
            <LightMode />
          </Stack>
        </Box>
        <Typography variant="body1">{Math.round(lightValue * 100)}%</Typography>
      </Box>
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
          Background Image Size:
        </Typography>
        <Box sx={{ width: 300 }}>
          <Stack spacing={2} direction="row" sx={{ mr: 1 }} alignItems="center">
            <ZoomIn />
            <Slider
              max={100}
              min={1}
              step={1}
              value={sizeValue}
              onChange={handleImageSizeValueChange}
            />
            <ZoomOut />
          </Stack>
        </Box>
        <Typography variant="body1">{sizeValue}%</Typography>
      </Box>
    </Box>
  )
}
