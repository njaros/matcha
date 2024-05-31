import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { CustomTheme } from './UI/CustomChakraTheme'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ChakraProvider theme={CustomTheme}>    
        <App />
    </ChakraProvider>
)