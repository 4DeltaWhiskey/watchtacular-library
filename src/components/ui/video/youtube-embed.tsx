
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      className="w-full h-full"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
};

export default YouTubeEmbed;
