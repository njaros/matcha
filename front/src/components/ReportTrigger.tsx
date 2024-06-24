import { Box, Button, ButtonGroup, Flex, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import Axios from "../tools/Caller";

export default function ReportTrigger(props: {user_id: string, optionAction: any}) {
    const initialFocusRef = useRef();
    const { onOpen, onClose, isOpen } = useDisclosure()

    function reportHandler() {
      Axios.post("relationship/report_user", {user_id: props.user_id}).then(
        () => {
          if (props.optionAction != null)
            props.optionAction();
        }
      ).catch(
        err => {
          console.warn(err);
        }
      ).finally(
        () => onClose()
      )
    }

    function blockHandler() {
      Axios.post("swipe/dislike_user", {target_id: props.user_id}).then(
        () => {
          if (props.optionAction != null)
            props.optionAction();
        }
      ).catch(
        err => {
          console.warn(err);
        }
      ).finally(
        () => onClose()
      )
    }

    return (
        <Popover    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    initialFocusRef={initialFocusRef}
                    placement="bottom"
                    >
            <PopoverTrigger>
              <Button>
                <Icon   className="ReportTriggerIcon"
                        size={8}
                        color="red"
                        as={AiOutlineWarning}/>
              </Button>
            </PopoverTrigger>
            <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Is this user causing trouble ?
        </PopoverHeader>
        <PopoverArrow bg='blue.800' />
        <PopoverCloseButton />
        <PopoverBody>
          If you judge that this user is causing trouble for any raison,
          you can send a report. This will contribute to the sanity of the website.<br/>
          Or you can just block him.<br/> In both cases you will never see this person again.
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          <ButtonGroup size='sm'>
            <Button colorScheme='green' onClick={reportHandler}>Send Report</Button>
            <Button colorScheme='red' onClick={blockHandler}>Block</Button>
            <Button colorScheme='blue' onClick={onClose} ref={initialFocusRef}>
              Cancel
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
    )
}