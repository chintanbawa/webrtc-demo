import React, { useState } from 'react';

//styles
import './index.scss';

const VideoPlayer = ({
  innerRef,
  className,
  insideCall,
  onCallEnd,
  onStateChange
}) => {
  const [enableCam, setEnableCam] = useState(true);
  const [enableMic, setEnableMic] = useState(true);

  return (
    <div className={`vp-container ${className}`}>
      <video className='vp-container__player' ref={innerRef} autoPlay />

      {onStateChange && (
        <div className='vp-container__controller'>
          <button
            className={`vp-container__controller__mic${
              enableMic ? '--disabled' : ''
            }`}
            onClick={() => {
              setEnableMic(!enableMic);
              onStateChange(false);
            }}
          >
            Turn Mic {enableMic ? 'Off' : 'On'}
          </button>
          <button
            className={`vp-container__controller__video${
              enableCam ? '--disabled' : ''
            }`}
            onClick={() => {
              setEnableCam(!enableCam);
              onStateChange(true);
            }}
          >
            Turn Cam {enableCam ? 'Off' : 'On'}
          </button>
          {insideCall && (
            <button
              className='vp-container__controller__hang-up'
              onClick={onCallEnd}
            >
              Hang Up
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
