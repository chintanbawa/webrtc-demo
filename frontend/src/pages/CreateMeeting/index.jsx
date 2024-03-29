import React, { useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import copy from 'copy-to-clipboard';

//styles
import './index.scss';

const CreateMeeting = () => {
  const [meetingLink, setMeetingLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsCopied(false);
  }, [meetingLink]);

  const generateMeetingLink = () => {
    const protocol =
      process.env.REACT_APP_ENVIRONMENT === 'development'
        ? 'http://'
        : 'https://';
    const meetingLink = `${protocol}${
      window.location.host
    }/meeting?channelName=${Date.now()}`;
    setMeetingLink(meetingLink);
  };
  return (
    <div className='create-meeting'>
      <h2>Create meeting link and share with your buddy!!</h2>
      <button onClick={generateMeetingLink}>Generate Meeting Link</button>
      {meetingLink && (
        <>
          <div
            className='create-meeting__meeting-info'
            onClick={() => {
              copy(meetingLink);
              setIsCopied(true);
            }}
          >
            <span>{meetingLink}</span>
            <FaCopy size={16} />
          </div>
          {isCopied && <span className='create-meeting__copied'>Copied</span>}
        </>
      )}
    </div>
  );
};

export default CreateMeeting;
