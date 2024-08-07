import { Box, Flex, Icon } from "@chakra-ui/react";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { BsTelephoneX } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { storeSocket } from "../../tools/Stores";

const headerIconSize = {base: 8, sm: 10, md: 12, lg: 14, xl: 16}

interface Props {
    mediaStream: MediaStream;
    isMuted?: boolean;
  }

interface VideoChatRoomProps {
  localStream: MediaStream;
}

const VideoFeed: FunctionComponent<Props> = ({
    mediaStream,
    isMuted = false,
}) => {
    return (
        <video
            ref={(ref) => {
                if (ref){
                    ref.srcObject = mediaStream
                }
            }}
            autoPlay={true}
            muted={isMuted}
        >

        </video>
    )
}

function useOfferSending(peerConnection: RTCPeerConnection){
    const { roomName } = useParams()
    const socket = storeSocket(state => state.socket)
    const sendOffer = useCallback(async () => {
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)
        socket?.emit('send_connection_offer', {
            roomName,
            offer
        })
    }, [roomName])
    
    return { sendOffer }
}

function useOffersListening(peerConnection: RTCPeerConnection){
    const { roomName } = useParams()
    const socket = storeSocket(state => state.socket)

    const handleConnectionOffer = useCallback(
        async ({offer} : {offer: RTCSessionDescriptionInit}) => {
            await peerConnection.setRemoteDescription(offer)
            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)
            socket?.emit('answer', {answer, roomName})
        }, [roomName]
    )
    
    return {
        handleConnectionOffer,
    }
}

function useAnswerProcessing(peerConnection: RTCPeerConnection){
    const handleOfferAnswer = useCallback(
        ({answer}: {answer: RTCSessionDescriptionInit}) => {
            peerConnection.setRemoteDescription(answer)
        }, [peerConnection]
    )
    return {
        handleOfferAnswer,
    }
}

function useChatConnection(peerConnection: RTCPeerConnection){
    const socket = storeSocket(state => state.socket)
    const { roomName } = useParams()
    const { sendOffer } = useOfferSending(peerConnection)
    const { handleConnectionOffer } = useOffersListening(peerConnection)
    const { handleOfferAnswer } = useAnswerProcessing(peerConnection)

    const handleConnection = useCallback(() => {
        socket?.emit('join_video_chat_room', roomName)
    }, [roomName])

    const handleReceiveCandidate = useCallback(
        ({candidate}: {candidate: RTCIceCandidate}) => {
            peerConnection.addIceCandidate(candidate)
        }, [peerConnection])

    useEffect(() => {
        handleConnection()
        socket?.on('answer', handleOfferAnswer)
        socket?.on('another_person_ready', sendOffer)
        socket?.on('send_connection_offer', handleConnectionOffer)
        socket?.on('send_candidate', handleReceiveCandidate);
        return () => {
            socket?.off('another_person_ready')
            socket?.off('send_connection_offer')
            socket?.off('answer')
            socket?.off('send_candidate')
        }
    }, [roomName, handleConnection, handleConnectionOffer, handleOfferAnswer, sendOffer]) 
}

function usePeerConnection(localStream: MediaStream, setGuestStream: (media: MediaStream) => void){
    const { roomName } = useParams()
    const socket = storeSocket(state => state.socket)

    const peerConnection = useMemo(() => {
        const connection = new RTCPeerConnection({
            iceServers: [{urls: 'stun:stun2.1.google.com:19302'}]
        })

        connection.addEventListener('icecandidate', ({candidate}) => {
            if (candidate)
                socket?.emit('send_candidate', {candidate, roomName})
        })

        connection.addEventListener('track', ({streams}) => {
            setGuestStream(streams[0])
        })

        localStream.getTracks().forEach((track) => {
            connection.addTrack(track, localStream)
        })
        return connection
    }, [localStream, roomName])

    return {
        peerConnection
    }
}

function useHangup(){
    const navigate = useNavigate()
    const { roomName } = useParams()
    const socket = storeSocket(state => state.socket)
    const hangup = (pc: RTCPeerConnection, localStream: MediaStream) => {
        if (pc) {
            pc.close();
        }
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        socket?.emit('leave_video_chat_room', roomName)        
        navigate(-1);
    };

    return { hangup };
}

export function useLocalCameraStream(){
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true/*, audio: true*/})
            .then((localStream) => {
                setLocalStream(localStream)
            })
    }, [])
    return {
        localStream,
    }
}

const VideoChatRoom: React.FC<VideoChatRoomProps> = ({ localStream }) => {
    const [ guestStream, setGuestStream ] = useState<MediaStream | null>(null)
    const { peerConnection } = usePeerConnection(localStream, (media: MediaStream) => setGuestStream(media))
    const socket = storeSocket(state => state.socket)
    const { hangup } = useHangup()
    useChatConnection(peerConnection);

    const handleHangupClick = () => {
        hangup(peerConnection, localStream);
    };

    function logVariable(variable: any) {
        if (variable)
            return true;
        return false;
    }

    useEffect(() => {
        socket?.on("chat_disconnection", () => {
            hangup(peerConnection, localStream)
        })
        return (() => {        
            hangup(peerConnection, localStream)
            socket?.off("chat_disconnection")
        })
    }, [])

    return (
        <>
            <Flex 
                flexDir={'column'} 
                bg={'#1F1F1F'}
                alignItems={'center'}
                justifyContent={'center'}
                w={'100%'}
                h={'100%'}
            >
                <Box>
                    {logVariable(guestStream) && ( <VideoFeed mediaStream={guestStream} isMuted={false}/>)}
                </Box>
                <Box 
                    position={"relative"}
                >
                    <VideoFeed mediaStream={localStream} isMuted={false} />
                    <Icon
                        as={BsTelephoneX}
                        boxSize={headerIconSize}
                        color={'white'}
                        position={'absolute'}
                        onClick={handleHangupClick}
                        top={'90%'}
                        left={'50%'}
                        transform={'translate(-50%, -50%)'}
                
                        >
                        Hang Up
                    </Icon>
                </Box>
                
                  
            </Flex>
        </>
    )
}

function VoiceChat() {
    const { localStream } = useLocalCameraStream()
    if (!localStream)
        return null



    return (
        <>
            {localStream && <VideoChatRoom localStream={localStream}/>}
        </>
    )
}

export default VoiceChat