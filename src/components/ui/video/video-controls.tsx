
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomSlider from "./custom-slider";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onMute: () => void;
  onVolumeChange: (value: number) => void;
  onSeek: (value: number) => void;
  onSpeedChange: (speed: number) => void;
  onFullscreen: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const VideoControls = ({
  isPlaying,
  isMuted,
  volume,
  progress,
  currentTime,
  duration,
  playbackSpeed,
  onPlayPause,
  onMute,
  onVolumeChange,
  onSeek,
  onSpeedChange,
  onFullscreen,
}: VideoControlsProps) => {
  return (
    <motion.div
      className="absolute bottom-0 w-full p-4 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl"
      initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      exit={{ y: 20, opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "circInOut", type: "spring" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white text-sm">{formatTime(currentTime)}</span>
        <CustomSlider value={progress} onChange={onSeek} className="flex-1" />
        <span className="text-white text-sm">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={onPlayPause}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#111111d1] hover:text-white"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
          <div className="flex items-center gap-x-1">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={onMute}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#111111d1] hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : volume > 0.5 ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <Volume1 className="h-5 w-5" />
                )}
              </Button>
            </motion.div>

            <div className="w-24">
              <CustomSlider value={volume * 100} onChange={onVolumeChange} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[0.5, 1, 1.5, 2].map((speed) => (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              key={speed}
            >
              <Button
                onClick={() => onSpeedChange(speed)}
                variant="ghost"
                size="icon"
                className={cn(
                  "text-white hover:bg-[#111111d1] hover:text-white",
                  playbackSpeed === speed && "bg-[#111111d1]"
                )}
              >
                {speed}x
              </Button>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={onFullscreen}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#111111d1] hover:text-white"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoControls;
