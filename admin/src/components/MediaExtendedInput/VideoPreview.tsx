import * as React from 'react';
import { Box } from '@strapi/design-system';
import { styled } from 'styled-components';

const Video = styled.video`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

interface VideoPreviewProps {
  url: string;
  alt?: string;
  onLoadDuration?: (duration: number) => void;
}

export const VideoPreview = ({ url, alt, onLoadDuration }: VideoPreviewProps) => {
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    
    if (video.currentTime > 0) {
      const canvas = document.createElement('canvas');
      
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      
      // Copy video element's style to canvas
      canvas.style.height = '100%';
      canvas.style.width = '100%';
      canvas.style.objectFit = 'contain';
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      }
      
      // Pass duration to parent if callback provided
      if (onLoadDuration && video.duration) {
        onLoadDuration(video.duration);
      }
      
      // Replace video with canvas showing the thumbnail
      video.replaceWith(canvas);
    }
  };

  return (
    <Box height="100%" width="100%">
      <Video
        src={url}
        onTimeUpdate={handleTimeUpdate}
        aria-label={alt}
        onLoadedMetadata={(e) => {
          // Force play to trigger timeupdate
          e.currentTarget.play().catch(() => {
            // Ignore autoplay errors
          });
        }}
        muted
      />
    </Box>
  );
};