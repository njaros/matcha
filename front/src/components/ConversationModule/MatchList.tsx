// import { Avatar, Box, Flex, Text } from "@chakra-ui/react"
// import { storeConvBool, storeMe, storeMessageList, storeMsgCount, storeRoomList, storeSocket } from "../../tools/Stores"
// import { useEffect, useState } from "react"
// import { MatchesList, Room_info } from "../../tools/interface"
// import Axios from "../../tools/Caller"
// import { parsePhotoFromBack } from "../../tools/Thingy"
// import Chatbox from "./Chatbox"

// function Match(props: {conv: any, index: number, me: any, join_room: any, setRoom: any, setMessageList: any}){
    
//     return (
//          <Flex 
//             key={props.index} 
//             flexDir={'column'} 
//             alignItems="center"  
//             padding={'10px'}
//             onClick={() => {
//                 console.log('from match', props.conv)
//                 props.join_room(props.conv.id)
//                 props.setRoom(props.conv)
//                 props.setMessageList(props.conv)
//             }}
//             >
//             <Avatar src={props.me?.id === props.conv.user_1.user_id ? props.conv.user_2?.photo : props.conv?.user_1?.photo}/>
//             <Box>{props.conv.name}</Box>
//         </Flex>
//     )
// }

// function MatchList(){

//     const [matchList, setMatchList] = useState<MatchesList[]>([])
//     const [convBool, updateConvBool] = storeConvBool(state => [state.convBool, state.updateConvBool])
//     const socket = storeSocket(state => state.socket)
//     const [msgList, setMsgList] = storeMessageList(state => [state.messageList, state.updateMessageList])
//     const [room, setRoom] = useState<Room_info>()
//     const me = storeMe(state => state.me)
//     const roomList = storeRoomList(state => state.roomList)



//     const join_room = async (room_id: string) => {
//         socket?.emit('join_chat_room', room_id)
//         updateConvBool(!convBool)
//     }

//     const setMessageList = async (conv: Room_info) => {
//         try{
//             const res = await Axios.post('/chat/get_message_list_by_room_id', {'room_id': conv?.id})
//             setMsgList(res.data)
//         }
//         catch(err){
//             if (err)
//                 console.error(err)
//         }
//     }
//     return (
//         <Flex 
//             justifyContent="center" 
//             alignItems="center"
//             paddingTop={'10px'}
//             h={'25%'}
//             hidden={convBool}
//         >
//             <Flex
//                 borderRadius={'5px'}
//                 padding={'5px 5px'}
//                 bg={'#f2f2f2'}
//                 w={'95%'}
//                 flexDirection={'column'}
//                 h={'100%'} 
//             >
//                 <Text fontWeight={'bold'}>Matches with you !</Text>
//                 <Flex flexDir={'row'} overflowX={'auto'}>
//                     {roomList && roomList.map((elt, index) => {
//                         return (
//                             <Box key={index}>
//                                 <Match
//                                     conv={elt}
//                                     index={index}
//                                     me={me}
//                                     join_room={join_room} 
//                                     setRoom={setRoom} 
//                                     setMessageList={setMessageList}
//                                 />
//                             </Box>
//                         )
//                     })}
//                 </Flex>
//             </Flex>
//             <Chatbox room={room}></Chatbox>
//         </Flex>
//     )
// }

// export default MatchList

