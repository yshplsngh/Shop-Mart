import { Helmet, HelmetProvider } from 'react-helmet-async'
import { APP_NAME } from './constant'

interface IProps {
  title: string
}

const HeadInfo: React.FC<IProps> = ({ title }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{APP_NAME} - {title}</title>
      </Helmet>
    </HelmetProvider>
  )
}

export default HeadInfo