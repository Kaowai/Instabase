interface Props {
  imageHighLight: string
  title: string
  onNavigateToStory: () => void
}
const HighlightStory = ({ imageHighLight, title, onNavigateToStory }: Props) => {
  return (
    <div className='flex justify-center items-center gap-2 flex-col cursor-pointer' onClick={onNavigateToStory}>
      <div className='w-24 h-24 rounded-full border-2 border-grey-color1 p-1'>
        <img
          className='rounded-full object-cover border-2 border-gray-300 h-full max-h-[150px] aspect-square'
          src={imageHighLight}
          alt='Avatar'
        />
      </div>
      <span className='font-medium text-ellipsis overflow-hidden whitespace-nowrap w-16 uppercase'>{title}</span>
    </div>
  )
}

export default HighlightStory
