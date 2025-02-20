interface Props {
  type: string
  placeholder: string
  autofocus: boolean
}
const Input = ({ type, placeholder, autofocus }: Props) => {
  return (
    <div className='w-full h-32 '>
      <input autoFocus={autofocus} className="font-" type={type} placeholder={placeholder} />
    </div>
  )
}

export default Input
