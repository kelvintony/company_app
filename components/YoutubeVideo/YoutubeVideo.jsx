import React from 'react';
import styles from './YoutubeVideo.module.css';

const YoutubeVideo = () => {
  const videoId = 'i7ul4LNTnfI';

  return (
    <div className={styles.video_responsive}>
      <iframe
        width='853'
        height='480'
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        title='Embedded youtube'
      />
    </div>
  );
};

export default YoutubeVideo;
