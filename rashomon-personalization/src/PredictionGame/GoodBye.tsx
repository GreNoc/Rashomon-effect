import BackgroundContainer from "../utils/BackgroundContainer/BackgroundContainer.tsx";
import BoxCol from "../utils/BoxCol/BoxCol.tsx";
import MarkdownBox from "../utils/MarkdownBox/MarkdownBox.tsx";
import Box from "../utils/Box/Box.tsx";

const mdGoodbye=`
# Goodbye

You have successfully completed the study. Thank you for your participation.

Follow this [completion link](https://app.prolific.com/submissions/complete?cc=C1O6KV7K) to get back to Prolific.
`
const GoodBye: React.FC = () : JSX.Element => {
    return (
        <BackgroundContainer>
           <BoxCol>
               <Box color={"transparent"}>
                   <MarkdownBox markdown={mdGoodbye}/>
               </Box>
           </BoxCol>
        </BackgroundContainer>
    )
}

export default GoodBye;
