"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion"

// Enhanced animation variants with more sophisticated transitions
const imageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1200 : -1200,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1200 : -1200,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 15 : -15,
  }),
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

const VISIBLE_THUMBNAILS = 6

export default function PremiumImageSlider({ imgs, modal, setModal }) {
  const [state, setState] = useState({
    index: 0,
    direction: 0,
    isLoading: true,
    thumbnailOffset: 0,
    showControls: true,
  })

  const { index, direction, isLoading, thumbnailOffset, showControls } = state
  const activeImg = useMemo(() => imgs[index], [imgs, index])
  const controlsTimeoutRef = useRef(null)
  const mouseY = useMotionValue(0)
  const backgroundBlur = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 800], [20, 5])

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    setState((s) => ({ ...s, showControls: true }))
    controlsTimeoutRef.current = setTimeout(() => {
      setState((s) => ({ ...s, showControls: false }))
    }, 3000)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseY.set(e.clientY)
      resetControlsTimeout()
    }

    if (modal) {
      window.addEventListener("mousemove", handleMouseMove)
      resetControlsTimeout()
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [modal, mouseY])

  // Body scroll lock
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden"
      document.body.style.userSelect = "none"
    }
    return () => {
      document.body.style.overflow = "auto"
      document.body.style.userSelect = "auto"
    }
  }, [modal])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modal) return
      switch (e.key) {
        case "ArrowRight":
          paginate(1)
          break
        case "ArrowLeft":
          paginate(-1)
          break
        case "Escape":
          closeModal()
          break
        default:
          break // Do nothing for unhandled keys
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown) // eslint-disable-next-line
  }, [modal, index])

  // Preload images
  useEffect(() => {
    if (imgs.length <= 1) return
    const preloadImage = (i) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = imgs[i]
    }
    preloadImage((index + 1) % imgs.length)
    preloadImage((index - 1 + imgs.length) % imgs.length)
  }, [index, imgs])

  // Auto-scroll thumbnails
  useEffect(() => {
    const isVisible = index >= thumbnailOffset && index < thumbnailOffset + VISIBLE_THUMBNAILS
    if (!isVisible) {
      const newOffset = Math.max(
        0,
        Math.min(index - Math.floor(VISIBLE_THUMBNAILS / 2), imgs.length - VISIBLE_THUMBNAILS),
      )
      setState((s) => ({ ...s, thumbnailOffset: newOffset }))
    }
  }, [index, thumbnailOffset, imgs.length])

  const paginate = (newDirection) => {
    const newIndex = (index + newDirection + imgs.length) % imgs.length
    setState((s) => ({
      ...s,
      index: newIndex,
      direction: newDirection,
      isLoading: true,
    }))
  }

  const jumpToIndex = (newIndex) => {
    setState((s) => ({
      ...s,
      index: newIndex,
      direction: newIndex > index ? 1 : -1,
      isLoading: true,
    }))
  }

  const handleThumbnailScroll = (scrollDirection) => {
    const newOffset = thumbnailOffset + scrollDirection * Math.floor(VISIBLE_THUMBNAILS / 2)
    const maxOffset = Math.max(0, imgs.length - VISIBLE_THUMBNAILS)
    setState((s) => ({ ...s, thumbnailOffset: Math.max(0, Math.min(newOffset, maxOffset)) }))
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(activeImg)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `image-${index + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      window.open(activeImg, "_blank")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Image ${index + 1}`,
          text: `Check out this image from our gallery`,
          url: activeImg,
        })
      } catch (error) {
        console.error("Share failed:", error)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(activeImg)
      console.log("Image URL copied to clipboard")
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  const closeModal = () => setModal(false)

  if (!modal) return null

  const showThumbnailNav = imgs.length > VISIBLE_THUMBNAILS
  const progress = ((index + 1) / imgs.length) * 100

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex flex-col"
        onClick={closeModal}
      >
        {/* Dynamic Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"
          style={{ filter: `blur(${backgroundBlur}px)` }}
        />

        {/* Animated Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-teal-600/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-l from-pink-600/10 via-orange-600/10 to-yellow-600/10 animation-delay-1000" />
        </div>

        {/* Backdrop Blur */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />

        {/* Main Content Container */}
        <div className="relative w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Top Controls Bar */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: showControls ? 0 : -100,
              opacity: showControls ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 left-0 right-0 z-30 p-6"
          >
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              {/* Image Counter */}
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl font-medium">
                  <span className="text-white/60">Image</span> {index + 1} <span className="text-white/60">of</span>{" "}
                  {imgs.length}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                  title="Download image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15V3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                  title="Share image"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 6L12 2L8 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 2V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={closeModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl hover:bg-red-500/50 transition-all duration-300"
                  title="Close (Press Escape)"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 origin-left z-40"
            style={{ width: `${progress}%` }}
          />

          {/* Main Image Area */}
          <div className="flex-1 relative flex items-center justify-center p-6">
            {/* Navigation Buttons */}
            {imgs.length > 1 && (
              <>
                <motion.button
                  onClick={() => paginate(-1)}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{
                    x: showControls ? 0 : -100,
                    opacity: showControls ? 1 : 0,
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 hover:bg-white/20 transition-all duration-300"
                  title="Previous image (Left arrow)"
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <motion.button
                  onClick={() => paginate(1)}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{
                    x: showControls ? 0 : 100,
                    opacity: showControls ? 1 : 0,
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 hover:bg-white/20 transition-all duration-300"
                  title="Next image (Right arrow)"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </>
            )}

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                >
                  <Loader2 className="text-4xl text-white animate-spin" />
                </motion.div>
              )}

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeImg}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { type: "spring", stiffness: 400, damping: 25 },
                    rotateY: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                  className="absolute max-w-full max-h-full"
                >
                  <img
                    src={activeImg || "/placeholder.svg"}
                    onLoad={() => setState((s) => ({ ...s, isLoading: false }))}
                    className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
                    style={{
                      opacity: isLoading ? 0 : 1,
                      filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))",
                    }}
                    alt={`Gallery ${index + 1}`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Thumbnail Strip */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: showControls ? 0 : 100,
              opacity: showControls ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="p-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                {/* Thumbnail Navigation */}
                {showThumbnailNav && (
                  <motion.button
                    onClick={() => handleThumbnailScroll(-1)}
                    disabled={thumbnailOffset === 0}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                )}

                {/* Thumbnail Container */}
                <div className="flex-1 max-w-2xl overflow-hidden">
                  <motion.div
                    className="flex gap-3 h-20"
                    animate={{
                      x: `-${thumbnailOffset * (80 + 12)}px`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 40,
                    }}
                  >
                    {imgs.map((img, i) => (
                      <motion.div
                        key={i}
                        onClick={() => jumpToIndex(i)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative rounded-xl cursor-pointer flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-300 ${
                          index === i ? "ring-2 ring-white shadow-2xl" : "ring-1 ring-white/20"
                        }`}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                            index === i ? "opacity-0" : "opacity-50 hover:opacity-20"
                          }`}
                        />
                        {index === i && (
                          <motion.div
                            layoutId="activeThumbnail"
                            className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {showThumbnailNav && (
                  <motion.button
                    onClick={() => handleThumbnailScroll(1)}
                    disabled={thumbnailOffset + VISIBLE_THUMBNAILS >= imgs.length}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                )}
              </div>

              {/* Progress Indicator */}
              {showThumbnailNav && (
                <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    initial={false}
                    animate={{
                      width: `${(VISIBLE_THUMBNAILS / imgs.length) * 100}%`,
                      marginLeft: `${(thumbnailOffset / imgs.length) * 100}%`,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 50 }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}