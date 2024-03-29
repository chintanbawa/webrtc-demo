import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

//pages
import MeetingView from './MeetingView';
import { useNavigate, useSearchParams } from 'react-router-dom';

const servers = {};

const Meeting = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const channelName = searchParams.get('channelName');
  const userId = useMemo(() => Math.floor(Math.random() * 100000), []);
  const ws = useRef(null);
  const localPeerConnection = useRef(null);

  const [isInMeeting, setIsInMeeting] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const loadLocalStream = async () => {
    const constraints = {
      video: {
        facingMode: 'user'
      },
      audio: {
        echoCancellation: true
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
    } catch (error) {
      console.log('Unable to get local media stream', error);
    }
  };

  const handleCallEnd = useCallback(() => {
    if (
      ws.current.readyState !== WebSocket.OPEN ||
      !localPeerConnection.current ||
      !localStream
    )
      return;

    localPeerConnection.current.close();
    localPeerConnection.current = null;
    localStream.getTracks().forEach(function (track) {
      track.stop();
    });
    sendWsMessage('quit', {
      channelName,
      userId
    });
    navigate('/');
  }, [channelName, localStream, navigate, userId]);

  useEffect(() => {
    window.addEventListener('beforeunload', function () {
      handleCallEnd();
    });
  }, [handleCallEnd]);

  useEffect(() => {
    const wsClient = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);
    ws.current = wsClient;

    wsClient.onopen = () => {
      console.log('ws opened');
      loadLocalStream();
    };
    wsClient.onclose = () => console.log('ws closed');

    return () => {
      console.log('wsClient.close()');
      wsClient.close();
    };
  }, [channelName, userId]);

  const createPeerConnection = useCallback(
    isAnswer => {
      if (!localStream) return;
      localPeerConnection.current = new RTCPeerConnection(servers);
      localPeerConnection.current.onicecandidate = event => {
        // console.log(event.candidate);
        if (!event.candidate) {
          const answer = localPeerConnection.current.localDescription;
          sendWsMessage(isAnswer ? 'send_answer' : 'send_offer', {
            channelName,
            userId,
            sdp: answer
          });
        }
      };
      localPeerConnection.current.ontrack = event => {
        const stream = new MediaStream();
        event.streams[0].getTracks().forEach(track => {
          stream.addTrack(track);
        });
        setRemoteStream(stream);
      };
      localStream
        .getTracks()
        .forEach(track =>
          localPeerConnection.current.addTrack(track, localStream)
        );
    },
    [channelName, localStream, userId]
  );

  const createOffer = useCallback(() => {
    createPeerConnection(false);
    localPeerConnection.current.createOffer().then(getLocalDescription);
    setIsInMeeting(true);
  }, [createPeerConnection]);

  const onAnswer = useCallback(
    offer => {
      createPeerConnection(true);
      localPeerConnection.current.setRemoteDescription(offer);
      localPeerConnection.current.createAnswer().then(getAnswerDescription);
    },
    [createPeerConnection]
  );

  const getRemoteDescription = answer => {
    // console.log('gotRemoteDescription invoked:', answer);
    if (localPeerConnection.current)
      localPeerConnection.current.setRemoteDescription(answer);
  };

  useEffect(() => {
    ws.current.onmessage = message => {
      // console.log('ws message received', message.data);
      const parsedMessage = JSON.parse(message.data);
      switch (parsedMessage.type) {
        case 'joined': {
          const body = parsedMessage.body;
          console.log('users in this channel', body);
          createOffer();
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
          handleCallEnd();
          break;
        }
        default:
          break;
      }
    };
  }, [onAnswer, handleCallEnd, createOffer]);

  const sendWsMessage = (type, body) => {
    // console.log('sendWsMessage invoked', type, body);
    ws.current.send(
      JSON.stringify({
        type,
        body
      })
    );
  };

  const getLocalDescription = offer => {
    if (localPeerConnection.current)
      localPeerConnection.current.setLocalDescription(offer);
  };

  const getAnswerDescription = answer => {
    // console.log('gotAnswerDescription invoked:', answer);
    if (localPeerConnection.current)
      localPeerConnection.current.setLocalDescription(answer);
  };

  return (
    <MeetingView
      isInMeeting={isInMeeting}
      localStream={localStream}
      setLocalStream={setLocalStream}
      remoteStream={remoteStream}
      onJoinClick={() =>
        sendWsMessage('join', {
          channelName,
          userId
        })
      }
      onCallEnd={handleCallEnd}
    />
  );
};

export default Meeting;
