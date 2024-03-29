import React, { useState } from 'react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash
} from 'react-icons/fa';
import { PiPhoneSlashFill } from 'react-icons/pi';

//styles
import './index.scss';

const VideoPlayer = ({
  innerRef,
  className,
  insideCall,
  onCallEnd,
  onStateChange
}) => {
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableMic, setEnableMic] = useState(true);

  return (
    <div className={`vp-container ${className}`}>
      <video
        className='vp-container__player'
        ref={innerRef}
        autoPlay
        muted={!!onStateChange}
        playsInline
      />

      {onStateChange && (
        <div className='vp-container__controller'>
          <div
            className='vp-container__controller__container--mic'
            onClick={() => {
              setEnableMic(!enableMic);
              onStateChange(false);
            }}
          >
            {enableMic ? (
              <FaMicrophone size={25} />
            ) : (
              <FaMicrophoneSlash size={25} />
            )}
          </div>
          <div
            className='vp-container__controller__container--video'
            onClick={() => {
              setEnableVideo(!enableVideo);
              onStateChange(true);
            }}
          >
            {enableVideo ? <FaVideo size={25} /> : <FaVideoSlash size={25} />}
          </div>
          {insideCall && (
            <div
              className='vp-container__controller__container--call-end'
              onClick={onCallEnd}
            >
              <PiPhoneSlashFill size={25} color='white' />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
