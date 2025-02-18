
"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YouTubeEmbed from "./video/youtube-embed";
import VideoControls from "./video/video-controls";
import { isYouTubeUrl, getYouTubeVideoId } from "./video/utils";

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isYouTube = isYouTubeUrl(src);
  const youtubeVideoId = isYouTube ? getYouTubeVideoId(src) : null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = value / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isFinite(progress) ? progress : 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current && videoRef.current.duration) {
      const time = (value / 100) * videoRef.current.duration;
      if (isFinite(time)) {
        videoRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const setSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  if (isYouTube && youtubeVideoId) {
    return (
      <div className="relative w-full aspect-video mx-auto rounded-xl overflow-hidden bg-black">
        <YouTubeEmbed videoId={youtubeVideoId} />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full mx-auto rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        src={src}
        onClick={togglePlay}
      />

      <AnimatePresence>
        {showControls && (
          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            progress={progress}
            currentTime={currentTime}
            duration={duration}
            playbackSpeed={playbackSpeed}
            onPlayPause={togglePlay}
            onMute={toggleMute}
            onVolumeChange={handleVolumeChange}
            onSeek={handleSeek}
            onSpeedChange={setSpeed}
            onFullscreen={toggleFullscreen}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayer;
