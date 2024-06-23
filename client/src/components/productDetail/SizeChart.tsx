interface IProps {
  availableSizeParameters: string[]
  sizeChart: object[]
}

const SizeChart: React.FC<IProps> = ({ availableSizeParameters, sizeChart }) => {
  return (
    <div className='overflow-x-auto mt-10 md:w-[80%] w-full m-auto'>
      <table className='w-full text-center'>
        <thead className='text-sm text-white font-normal bg-black'>
          <tr>
            <th className='py-4 rounded-l-lg'>Size</th>
            {
              availableSizeParameters.map((item, idx) => (
                <th key={idx} className={`py-4 ${idx === availableSizeParameters.length - 1 ? 'rounded-r-lg' : ''}`}>{item}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            sizeChart.map((item, sizeIdx) => (
              <tr key={sizeIdx} className='border-b border-gray-300'>
                {/* @ts-ignore */}
                <td className='py-4'>{item.size}</td>
                {
                  Object.keys(sizeChart![sizeIdx]).filter(item => item !== 'size').map((param, paramIdx) => (
                    // @ts-ignore
                    <td key={paramIdx}>{sizeChart![sizeIdx][param]}</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default SizeChart