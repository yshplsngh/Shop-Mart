interface IProps {
  size: string
}

const Logo: React.FC<IProps> = ({ size }) => {
  return (
    <div className={`${size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'} rounded-md bg-gray-200`}>

    </div>
  )
}

export default Logo