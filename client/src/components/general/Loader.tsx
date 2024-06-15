interface IProps {
  size?: string
}

const Loader: React.FC<IProps> = ({ size }) => {
  return (
    <div className={`animate-spin border-2 border-white ${size === 'xl' ? 'w-[60px] h-[60px]' : size === '2xl' ? 'w-[100px] h-[100px]' : 'w-[25px] h-[25px]'} rounded-full border-t-3 border-t-gray-400 m-auto`} />
  )
}

export default Loader