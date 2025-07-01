"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { X, ChevronLeft, ChevronRight, Loader2, Download, Share2 } from "lucide-react"
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "framer-motion"

// --- Animation Variants ---

// Enhanced container variants with staggered children for a smoother entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Refined image variants for a more fluid and physical transition
const imageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? -25 : 25,
    filter: "blur(10px)",
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 35,
      duration: 0.6,
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
    scale: 0.9,
    rotateY: direction < 0 ? -25 : 25,
    filter: "blur(10px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 35,
      duration: 0.4,
    },
  }),
}

// Child variants for staggered animations in controls
const childVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
}

const VISIBLE_THUMBNAILS = 7

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

  // --- Dynamic Background Effects ---
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0)
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0)
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 400, damping: 50 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 400, damping: 50 });

  const spotlightStyle = {
    background: useTransform(
      [smoothMouseX, smoothMouseY],
      ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(180, 120, 255, 0.1), transparent 50%)`
    ),
  }

  // --- Hooks for side effects ---

  // Auto-hide controls logic
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    setState((s) => ({ ...s, showControls: true }))
    controlsTimeoutRef.current = setTimeout(() => {
      setState((s) => ({ ...s, showControls: false }))
    }, 3000)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal])

  // Body scroll lock
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden"
      document.body.style.userSelect = "none"
    } else {
      document.body.style.overflow = "auto"
      document.body.style.userSelect = "auto"
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
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, index])
  
  // Preload images for smoother navigation
  useEffect(() => {
    if (imgs.length <= 1) return
    const preloadImage = (i) => {
      const img = new Image()
      img.src = imgs[i]
    }
    preloadImage((index + 1) % imgs.length)
    preloadImage((index - 1 + imgs.length) % imgs.length)
  }, [index, imgs])

  // Auto-scroll thumbnails into view
  useEffect(() => {
    const isVisible = index >= thumbnailOffset && index < thumbnailOffset + VISIBLE_THUMBNAILS
    if (!isVisible) {
      const newOffset = Math.max(
        0,
        Math.min(index - Math.floor(VISIBLE_THUMBNAILS / 2), imgs.length - VISIBLE_THUMBNAILS)
      )
      setState((s) => ({ ...s, thumbnailOffset: newOffset }))
    }
  }, [index, thumbnailOffset, imgs.length])

  // --- Handler Functions ---

  const paginate = (newDirection) => {
    const newIndex = (index + newDirection + imgs.length) % imgs.length
    setState((s) => ({ ...s, index: newIndex, direction: newDirection, isLoading: true }))
  }

  const jumpToIndex = (newIndex) => {
    if (newIndex === index) return;
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
          text: `Check out this image!`,
          url: activeImg,
        })
      } catch (error) {
        console.error("Share failed:", error)
      }
    } else {
      await navigator.clipboard.writeText(activeImg)
      alert("Image URL copied to clipboard!")
    }
  }

  const closeModal = () => setModal(false)

  if (!modal) return null

  const showThumbnailNav = imgs.length > VISIBLE_THUMBNAILS
  const progress = ((index + 1) / imgs.length) * 100

  // --- Render ---

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
          onClick={closeModal}
        >
          {/* Dynamic Spotlight Background */}
          <motion.div className="absolute inset-0" style={spotlightStyle} />
          <div className="absolute inset-0 backdrop-blur-lg" />

          {/* Main Content Area */}
          <div className="relative w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Top Controls Bar */}
            <motion.div
              animate={{
                y: showControls ? 0 : -100,
                opacity: showControls ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 right-0 z-30 p-4"
            >
              <div className="flex justify-between items-center max-w-7xl mx-auto">
                <motion.div variants={childVariants} className="font-mono text-sm bg-black/20 backdrop-blur-sm border border-white/10 text-white px-3 py-1.5 rounded-lg">
                  {String(index + 1).padStart(2, "0")} / {String(imgs.length).padStart(2, "0")}
                </motion.div>

                <motion.div variants={childVariants} className="flex items-center gap-2">
                  {[
                    { icon: <Download size={16} />, onClick: handleDownload, title: "Download" },
                    { icon: <Share2 size={16} />, onClick: handleShare, title: "Share" },
                    { icon: <X size={18} />, onClick: closeModal, title: "Close (Esc)" },
                  ].map((btn, i) => (
                    <motion.button
                      key={i}
                      onClick={btn.onClick}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-black/20 backdrop-blur-sm border border-white/10 text-white p-2 rounded-lg hover:border-white/20 transition-colors"
                      title={btn.title}
                    >
                      {btn.icon}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-400"
                style={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            </div>

            {/* Main Image Stage */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
              {imgs.length > 1 &&
                [-1, 1].map((d) => (
                  <motion.button
                    key={d}
                    onClick={() => paginate(d)}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: showControls ? 1 : 0,
                      x: showControls ? 0 : d * -20,
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.4)" }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute ${d === -1 ? "left-2 md:left-4" : "right-2 md:right-4"} z-20 bg-black/20 backdrop-blur-sm border border-white/10 text-white rounded-full p-3 transition-opacity`}
                    title={d === -1 ? "Previous (Left Arrow)" : "Next (Right Arrow)"}
                  >
                    {d === -1 ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                  </motion.button>
                ))}

              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute z-10">
                    <Loader2 className="text-4xl text-white/50 animate-spin" />
                  </motion.div>
                )}
                <AnimatePresence custom={direction}>
                  <motion.img
                    key={activeImg}
                    src={activeImg || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    onLoad={() => setState((s) => ({ ...s, isLoading: false }))}
                    className="absolute max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                    style={{
                      opacity: isLoading ? 0 : 1,
                      filter: "drop-shadow(0 20px 25px rgba(0,0,0,0.4))",
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Thumbnail Strip */}
            <motion.div
              animate={{
                y: showControls ? 0 : 100,
                opacity: showControls ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="pb-4"
            >
              <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 px-2">
                {showThumbnailNav && (
                  <motion.button
                    onClick={() => handleThumbnailScroll(-1)}
                    disabled={thumbnailOffset === 0}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="bg-black/20 backdrop-blur-sm border border-white/10 text-white p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </motion.button>
                )}

                <div className="flex-1 max-w-3xl overflow-hidden">
                  <motion.div
                    className="flex gap-2 h-16"
                    animate={{ x: `-${thumbnailOffset * (64 + 8)}px` }}
                    transition={{ type: "spring", stiffness: 400, damping: 50 }}
                  >
                    {imgs.map((img, i) => (
                      <motion.div
                        key={i}
                        onClick={() => jumpToIndex(i)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="relative rounded-md cursor-pointer flex-shrink-0 w-16 h-16 overflow-hidden"
                      >
                        <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        <motion.div
                          className="absolute inset-0 bg-black"
                          animate={{ opacity: index === i ? 0 : 0.5 }}
                          whileHover={{ opacity: 0.2 }}
                        />
                         {index === i && (
                          <motion.div
                            layoutId="activeThumbnailBorder"
                            className="absolute inset-0 border-2 border-white rounded-md"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="bg-black/20 backdrop-blur-sm border border-white/10 text-white p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}