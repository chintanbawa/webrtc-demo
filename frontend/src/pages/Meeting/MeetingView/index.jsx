import React, { useEffect, useRef } from 'react';

//components
import VideoPlayer from '../../../components/VideoPlayer';
//styles
import './index.scss';

const MeetingView = ({
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
    if (localPlayer.current && localStream) {
      localPlayer.current.srcObject = localStream;
    }
  }, [localStream, isInMeeting]);

  useEffect(() => {
    if (remotePlayer.current && remoteStream) {
      remotePlayer.current.srcObject = remoteStream;
    }
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
    <div className='meeting-view'>
      {isInMeeting ? (
        <div className='in-meeting'>
          <div className='in-meeting__remote-player'>
            {remoteStream ? (
              <VideoPlayer innerRef={remotePlayer} />
            ) : (
              <h2 style={{ color: 'white' }}>Your buddy hasn't joined yet!</h2>
            )}
          </div>
          <div className='in-meeting__divider' />
          <div className='in-meeting__local-player'>
            <VideoPlayer
              innerRef={localPlayer}
              onStateChange={handleStateChange}
              insideCall={isInMeeting}
              onCallEnd={onCallEnd}
            />
          </div>
        </div>
      ) : (
        <div className='before-join'>
          <p>{'Hello, Please click Join Meeting :)'}</p>
          <div className='before-join__local-player'>
            <VideoPlayer
              innerRef={localPlayer}
              onStateChange={handleStateChange}
              insideCall={isInMeeting}
              onCallEnd={onCallEnd}
            />
          </div>
          <button
            className='before-join__join'
            disabled={!localStream}
            onClick={onJoinClick}
          >
            Join Meeting
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingView;
