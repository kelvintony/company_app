import React from 'react';
import YouTube from 'react-youtube';

const YoutubeVideo = ({ videoId }) => {
  const videoId =
    'https://www.youtube.com/watch?v=i7ul4LNTnfI&pp=ygUWaW52ZXN0bWVudCBzaG9ydCB2aWRlbw%3D%3D';
  const opts = {
    height: '390',
    width: '640',
  };

  return <YouTube videoId={videoId} opts={opts} />;
};

export default YoutubeVideo;
