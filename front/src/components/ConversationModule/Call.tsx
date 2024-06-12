import { Box, Flex } from "@chakra-ui/react";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { storeSocket } from "../../tools/Stores";

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
            socket?.off('another_person_ready', sendOffer)
            socket?.off('send_connection_offer', handleConnectionOffer)
            socket?.off('answer', handleOfferAnswer)
            socket?.off('send_candidate', handleReceiveCandidate)
        }
    }, [roomName, handleConnection, handleConnectionOffer, handleOfferAnswer, sendOffer]) 
}

function usePeerConnection(localStream: MediaStream){
    const { roomName } = useParams()
    const [guestStream, setGuestStream] = useState<MediaStream | null>(null)
    const socket = storeSocket(state => state.socket)

    const peerConnection = useMemo(() => {
        const connection = new RTCPeerConnection({
            iceServers: [{urls: 'stun:stun2.1.google.com:19302'}]
        })

        connection.addEventListener('icecandidate', ({candidate}) => {
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
        peerConnection,
        guestStream,
    }
}

export function useLocalCameraStream(){
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then((localStream) => {
                setLocalStream(localStream)
            })
    }, [])
    return {
        localStream,
    }
}

const VideoChatRoom: React.FC<VideoChatRoomProps> = ({ localStream }) => {
  const { peerConnection, guestStream } = usePeerConnection(localStream);
  useChatConnection(peerConnection);

    return (
        <>
            <Flex 
                flexDir={'column'} 
                bg={'red'}
                w={'100%'}
                h={'100%'}
            >
                <Box
                    bg={'green'}
                    h={'50%'}
                >
                    <VideoFeed mediaStream={localStream} isMuted={true}/>
                </Box>
                <Box
                bg={'blue'}
                h={'50%'}
                >
                    {guestStream && ( <VideoFeed mediaStream={guestStream} isMuted={true}/>)}
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