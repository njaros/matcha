import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Box, ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ChakraProvider>
        <Box    display="flex"
                width="100%"
                height="100%"
                flexDirection="column"
                alignItems="center">
            <App />
        </Box>
    </ChakraProvider>
)