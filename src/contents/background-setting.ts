import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

import {
  BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY,
  BACKGROUND_IMAGE_SIZE_STORAGE_KEY,
  BACKGROUND_IMAGE_URL_STORAGE_KEY
} from "~src/utils/storage"

export const config: PlasmoCSConfig = {
  matches: ["*://web.whatsapp.com/*"],
  all_frames: true,
  run_at: "document_end"
}

const CHAT_BACKGROUND_CLASS_ID = "[data-asset-chat-background-dark]"
const CHAT_BACKGROUND_CLASS_ID_2 = "x1hx0egp"

const changeChatBackground = async (imageUrl: string | null) => {
  const chatBackground = document.querySelector(CHAT_BACKGROUND_CLASS_ID)
  if (chatBackground instanceof HTMLElement) {
    chatBackground.style.backgroundImage = `url(${imageUrl})`
    chatBackground.style.backgroundPosition = "center"
    chatBackground.style.backgroundRepeat = "no-repeat"
  }
}

const changeChatBackgroundBrightness = async (brightness: string | null) => {
  const chatBackground = document.querySelector(CHAT_BACKGROUND_CLASS_ID)
  if (chatBackground instanceof HTMLElement) {
    chatBackground.style.opacity = brightness ?? "1"
  }
}

const changeChatBackgroundSize = async (size: string | null) => {
  const chatBackground = document.querySelector(CHAT_BACKGROUND_CLASS_ID)
  if (chatBackground instanceof HTMLElement) {
    chatBackground.style.backgroundSize = size ? `${size}%` : "100%"
  }
}

export const handleChatBackgroundChange = async () => {
  const observer = new MutationObserver(async (mutations) => {
    const isChatBackgroundChanged = mutations.some((mutation) => {
      const targetElement = mutation.target as HTMLElement
      return targetElement.classList.contains(CHAT_BACKGROUND_CLASS_ID_2)
    })

    const imageUrl = (await storage.get(
      BACKGROUND_IMAGE_URL_STORAGE_KEY
    )) as unknown as string | null

    if (isChatBackgroundChanged && imageUrl) {
      const imageBrightness = (await storage.get(
        BACKGROUND_IMAGE_BRIGHTNESS_STORAGE_KEY
      )) as unknown as string | null

      const imageSize = (await storage.get(
        BACKGROUND_IMAGE_SIZE_STORAGE_KEY
      )) as unknown as string | null

      changeChatBackground(imageUrl)
      changeChatBackgroundBrightness(imageBrightness)
      changeChatBackgroundSize(imageSize)

      observer.disconnect()

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

const storage = new Storage({
  area: "local"
})

storage.watch({
  "local:backgroundImageUrl": (value) => {
    changeChatBackground(value.newValue)
  },
  "local:backgroundImageBrightness": (value) => {
    changeChatBackgroundBrightness(value.newValue)
  },
  "local:backgroundImageSize": (value) => {
    changeChatBackgroundSize(value.newValue)
  }
})

handleChatBackgroundChange()
