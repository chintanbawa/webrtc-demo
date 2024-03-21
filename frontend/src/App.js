import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

//styles
import './App.css';

//pages
import Meeting from './pages/Meeting';

const servers = {
}

const App = () => {
    const channelName = 'test';
    const userId = useMemo(() => Math.floor(Math.random() * 100000), []);
    const ws = useRef(null);
    const localPeerConnection = useRef(null);

    const [isInMeeting, setIsInMeeting] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const loadLocalStream = async () => {
        const constraints = {
            video: true, audio: false
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setLocalStream(stream);
        } catch (error) {
            console.log('Unable to get local media stream', error);
        }
    }

    useEffect(() => {
        const wsClient = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);
        ws.current = wsClient;

        wsClient.onopen = () => {
            console.log('ws opened');
            loadLocalStream()
            sendWsMessage('join', {
                channelName,
                userId,
            });
        };
        wsClient.onclose = () => console.log('ws closed');

        return () => {
            console.log('wsClient.close()');
            wsClient.close();
        };
    }, [userId])

    const createPeerConnection = useCallback((isAnswer) => {
        if (!localStream) return
        localPeerConnection.current = new RTCPeerConnection(servers);
        localPeerConnection.current.onicecandidate = event => {
            if (!event.candidate) {
                const answer = localPeerConnection.current.localDescription;
                sendWsMessage(isAnswer ? 'send_answer' : 'send_offer', {
                    channelName,
                    userId,
                    sdp: answer,
                });
            }
        };
        localPeerConnection.current.onaddstream = event => {
            setRemoteStream(event.stream);
        };
        localPeerConnection.current.addStream(localStream);
    }, [localStream, userId])

    const onAnswer = useCallback(
        offer => {
            createPeerConnection(true)
            localPeerConnection.current.setRemoteDescription(offer);
            localPeerConnection.current.createAnswer().then(getAnswerDescription);
        },
        [createPeerConnection],
    )

    const getRemoteDescription = answer => {
        console.log('gotRemoteDescription invoked:', answer);
        if (localPeerConnection.current) localPeerConnection.current.setRemoteDescription(answer);
    };

    useEffect(() => {
        ws.current.onmessage = message => {
            console.log('ws message received', message.data);
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.type) {
                case 'joined': {
                    const body = parsedMessage.body;
                    console.log('users in this channel', body);
                    break;
                }
                case 'offer_sdp_received': {
                    const offer = parsedMessage.body;

                    onAnswer(offer);
                    break;
                }
                case 'answer_sdp_received': {
                    getRemoteDescription(parsedMessage.body);
                    break;
                }
                case 'quit': {
                    break;
                }
                default:
                    break;
            }
        };
    }, [onAnswer]);



    const sendWsMessage = (type, body) => {
        console.log('sendWsMessage invoked', type, body);
        ws.current.send(
            JSON.stringify({
                type,
                body
            })
        );
    };

    const createOffer = () => {
        createPeerConnection(false)
        localPeerConnection.current.createOffer().then(getLocalDescription);
        setIsInMeeting(true)
    }

    const getLocalDescription = offer => {
        if (localPeerConnection.current)
            localPeerConnection.current.setLocalDescription(offer);
    };



    const getAnswerDescription = answer => {
        console.log('gotAnswerDescription invoked:', answer);
        if (localPeerConnection.current)
            localPeerConnection.current.setLocalDescription(answer);
    };

    const handleCallEnd = () => {
        localPeerConnection.current.close();
        localPeerConnection.current = null;
        setIsInMeeting(false);
    };

    return (
        <Meeting
            isInMeeting={isInMeeting}
            localStream={localStream}
            setLocalStream={setLocalStream}
            remoteStream={remoteStream}
            onJoinClick={createOffer}
            onCallEnd={handleCallEnd} />
    )
};

export default App;
