import { Box } from "@chakra-ui/react"

const footerFontSize = { base: '12px', sm: '14px', md: '16px', lg: '20px', xl: '24px' };

const Footer = () => {
    return (<Box fontSize={footerFontSize} width="95%" textAlign="center">Site de rencontre créé par njaros dit "Le N" et jereverd dit "le J".
           <br/>Projet extrémement formateur, sous-côté et supposé être terminé en moins de 100 heures.
    </Box>);
}

export default Footer;