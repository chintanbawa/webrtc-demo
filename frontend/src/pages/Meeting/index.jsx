import React, { useEffect, useRef } from 'react';

//components
import VideoPlayer from '../../components/VideoPlayer';
//styles
import './index.scss';

const Meeting = ({
  isInMeeting,
  localStream,
  setLocalStream,
  remoteStream,
  onJoinClick,
  onCallEnd
}) => {
  const localPlayer = useRef(null);
  const remotePlayer = useRef(null);

  useEffect(() => {
    if (localPlayer.current && localStream)
      localPlayer.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remotePlayer.current && remoteStream)
      remotePlayer.current.srcObject = remoteStream;
  }, [remoteStream]);

  const handleStateChange = async isVideo => {
    if (!localStream) return;

    if (isVideo) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    } else {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }

    setLocalStream(localStream);
  };

  return (
    <div className='meeting'>
      {isInMeeting && <VideoPlayer innerRef={remotePlayer} />}
      <div>
        <p></p>
        <VideoPlayer
          innerRef={localPlayer}
          className={
            isInMeeting ? 'meeting__local-player-1' : 'meeting__local-player-2'
          }
          onStateChange={handleStateChange}
          insideCall={isInMeeting}
          onCallEnd={onCallEnd}
        />
        {!isInMeeting && (
          <button
            className='meeting__join'
            disabled={!localStream}
            onClick={onJoinClick}
          >
            Join Meeting
          </button>
        )}
      </div>
    </div>
  );
};

export default Meeting;
