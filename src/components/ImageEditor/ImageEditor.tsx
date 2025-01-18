import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { BsPencil, BsType, BsArrowClockwise, BsSliders } from 'react-icons/bs'
import { MdOutlineUndo, MdOutlineRedo } from 'react-icons/md'

interface ImageEditorProps {
  image: string
  onSave: (editedImage: string) => void
  onCancel: () => void
}

interface TextInput {
  position: { x: number; y: number }
  isActive: boolean
}

const ImageEditor = ({ image, onSave, onCancel }: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'draw' | 'text' | null>(null)
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(5)
  const [rotation, setRotation] = useState(0)
  const [text, setText] = useState('')
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [textInput, setTextInput] = useState<TextInput>({
    position: { x: 0, y: 0 },
    isActive: false
  })
  const textInputRef = useRef<HTMLInputElement>(null)
  const [fontSize, setFontSize] = useState(20)
  const [fontFamily, setFontFamily] = useState('Arial')
  const textControlsRef = useRef<HTMLDivElement>(null)

  // Available fonts
  const fonts = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Comic Sans MS',
    'Impact',
    'Roboto',
    'Open Sans'
  ]

  // Initialize canvas and load image
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const img = new Image()
    img.src = image
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      const maxWidth = 800 // Maximum width
      const maxHeight = 600 // Maximum height
      let newWidth = img.width
      let newHeight = img.height

      // Scale down if image is too large
      if (newWidth > maxWidth || newHeight > maxHeight) {
        const ratio = Math.min(maxWidth / newWidth, maxHeight / newHeight)
        newWidth = newWidth * ratio
        newHeight = newHeight * ratio
      }

      // Set canvas dimensions
      canvas.width = newWidth
      canvas.height = newHeight
      setDimensions({ width: newWidth, height: newHeight })

      const context = canvas.getContext('2d')
      if (!context) return

      contextRef.current = context
      context.lineCap = 'round'
      context.strokeStyle = color
      context.lineWidth = lineWidth

      // Draw initial image with new dimensions
      context.drawImage(img, 0, 0, newWidth, newHeight)
      saveToHistory()
    }
  }, [image])

  // Drawing functions
  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    if (!contextRef.current || tool !== 'draw') return
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current || tool !== 'draw') return
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (!contextRef.current || tool !== 'draw') return
    contextRef.current.closePath()
    setIsDrawing(false)
    saveToHistory()
  }

  // Text functions
  const handleCanvasClick = ({ nativeEvent }: React.MouseEvent) => {
    if (tool !== 'text' || !contextRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Get canvas bounds
    const rect = canvas.getBoundingClientRect()

    // Calculate position relative to canvas
    const x = nativeEvent.clientX - rect.left
    const y = nativeEvent.clientY - rect.top

    setTextInput({
      position: { x, y },
      isActive: true
    })

    // Focus the input when it appears
    setTimeout(() => {
      textInputRef.current?.focus()
    }, 100)
  }

  const handleTextSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && contextRef.current && text.trim()) {
      const { x, y } = textInput.position

      contextRef.current.font = `${fontSize}px ${fontFamily}`
      contextRef.current.fillStyle = color
      contextRef.current.fillText(text, x, y)

      // Reset text input
      setText('')
      setTextInput((prev) => ({ ...prev, isActive: false }))
      saveToHistory()
    }
  }

  // Handle clicking outside text input
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        textInput.isActive &&
        textInputRef.current &&
        textControlsRef.current &&
        !textInputRef.current.contains(e.target as Node) &&
        !textControlsRef.current.contains(e.target as Node)
      ) {
        setTextInput((prev) => ({ ...prev, isActive: false }))
        setText('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [textInput.isActive])

  const addText = () => {
    if (!contextRef.current || !text) return
    contextRef.current.font = '20px Arial'
    contextRef.current.fillStyle = color
    contextRef.current.fillText(text, textPosition.x, textPosition.y)
    setText('')
    saveToHistory()
  }

  // Image adjustments
  const applyFilters = () => {
    if (!contextRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const context = contextRef.current

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      const brightnessValue = (brightness - 100) * 2.55
      data[i] = Math.min(255, Math.max(0, data[i] + brightnessValue))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightnessValue))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightnessValue))

      // Apply contrast
      const factor = (contrast + 100) / 100
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128))
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128))
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128))
    }

    context.putImageData(imageData, 0, 0)
    saveToHistory()
  }

  // History management
  const saveToHistory = () => {
    if (!canvasRef.current) return
    const newState = canvasRef.current.toDataURL()
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState])
    setHistoryIndex((prev) => prev + 1)
  }

  const undo = () => {
    if (historyIndex <= 0) return
    setHistoryIndex((prev) => prev - 1)
    loadFromHistory(historyIndex - 1)
  }

  const redo = () => {
    if (historyIndex >= history.length - 1) return
    setHistoryIndex((prev) => prev + 1)
    loadFromHistory(historyIndex + 1)
  }

  const loadFromHistory = (index: number) => {
    if (!contextRef.current || !canvasRef.current) return
    const img = new Image()
    img.src = history[index]
    img.onload = () => {
      contextRef.current?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      contextRef.current?.drawImage(img, 0, 0)
    }
  }

  // Rotation
  const rotateImage = () => {
    if (!contextRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const context = contextRef.current

    const newRotation = rotation + 90
    setRotation(newRotation)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // Swap canvas dimensions
    const temp = canvas.width
    canvas.width = canvas.height
    canvas.height = temp

    // Clear and rotate canvas
    context.save()
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate((Math.PI / 180) * newRotation)
    context.translate(-canvas.height / 2, -canvas.width / 2)
    context.putImageData(imageData, 0, 0)
    context.restore()

    saveToHistory()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'
    >
      <div className='bg-white rounded-lg p-4 flex flex-col gap-4 max-w-[900px] max-h-[80vh] overflow-auto'>
        {/* Toolbar */}
        <div className='flex justify-between items-center sticky top-0 bg-white z-10'>
          <div className='flex gap-2'>
            {/* Drawing tool */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTool('draw')}
              className={`p-2 rounded ${tool === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title='Draw'
            >
              <BsPencil size={20} />
            </motion.button>

            {/* Text tool */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTool('text')}
              className={`p-2 rounded ${tool === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title='Add Text'
            >
              <BsType size={20} />
            </motion.button>

            {/* Rotate button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={rotateImage}
              className='p-2 rounded bg-gray-200'
              title='Rotate'
            >
              <BsArrowClockwise size={20} />
            </motion.button>

            {/* Color picker */}
            <input
              type='color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className='w-10 h-10 rounded cursor-pointer'
              title='Color'
            />

            {/* Line width */}
            <input
              type='range'
              min='1'
              max='20'
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className='w-24'
              title='Line Width'
            />

            {/* Undo/Redo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={undo}
              disabled={historyIndex <= 0}
              className='p-2 rounded bg-gray-200 disabled:opacity-50'
              title='Undo'
            >
              <MdOutlineUndo size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className='p-2 rounded bg-gray-200 disabled:opacity-50'
              title='Redo'
            >
              <MdOutlineRedo size={20} />
            </motion.button>

            {/* Image adjustments */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <span>Brightness:</span>
                <input
                  type='range'
                  min='0'
                  max='200'
                  value={brightness}
                  onChange={(e) => {
                    setBrightness(Number(e.target.value))
                    applyFilters()
                  }}
                  className='w-24'
                />
              </div>
              <div className='flex items-center gap-2'>
                <span>Contrast:</span>
                <input
                  type='range'
                  min='0'
                  max='200'
                  value={contrast}
                  onChange={(e) => {
                    setContrast(Number(e.target.value))
                    applyFilters()
                  }}
                  className='w-24'
                />
              </div>
            </div>
          </div>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className='p-2 rounded hover:bg-gray-200'
          >
            <IoClose size={24} />
          </motion.button>
        </div>

        {/* Canvas Container */}
        <div className='relative flex justify-center items-center'>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onClick={handleCanvasClick}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(80vh - 200px)',
              objectFit: 'contain'
            }}
            className='border rounded cursor-crosshair'
          />

          {/* Floating text input with font options */}
          {textInput.isActive && tool === 'text' && (
            <motion.div
              ref={textControlsRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute',
                left: textInput.position.x,
                top: textInput.position.y,
                transform: 'translate(-50%, -50%)'
              }}
              className='flex flex-col gap-2 bg-white shadow-lg rounded-lg p-3 min-w-[300px]'
            >
              {/* Text input */}
              <input
                ref={textInputRef}
                type='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleTextSubmit}
                placeholder='Type and press Enter'
                className='border rounded px-2 py-1 text-sm w-full'
                style={{ fontFamily, fontSize: `${fontSize}px` }}
                autoFocus
              />

              {/* Font controls */}
              <div className='flex items-center gap-2 text-sm'>
                {/* Font family selector */}
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className='border rounded px-2 py-1 text-sm flex-1'
                  style={{ fontFamily }}
                >
                  {fonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>

                {/* Font size input */}
                <div className='flex items-center gap-1'>
                  <input
                    type='number'
                    value={fontSize}
                    onChange={(e) => setFontSize(Math.max(8, Math.min(72, Number(e.target.value))))}
                    className='border rounded px-2 py-1 text-sm w-16'
                    min='8'
                    max='72'
                  />
                  <span className='text-xs text-gray-500'>px</span>
                </div>

                {/* Color picker */}
                <input
                  type='color'
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className='w-8 h-8 rounded cursor-pointer'
                  title='Text Color'
                />
              </div>

              {/* Preview text */}
              <div
                className='text-xs text-gray-500 mt-1 overflow-hidden text-ellipsis whitespace-nowrap'
                style={{ fontFamily, fontSize: `${fontSize}px`, color }}
              >
                {text || 'Preview text'}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className='flex justify-end gap-2 sticky bottom-0 bg-white z-10'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className='px-4 py-2 bg-gray-200 rounded'
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSave(canvasRef.current?.toDataURL() || '')}
            className='px-4 py-2 bg-blue-500 text-white rounded'
          >
            Save
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ImageEditor
