
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoEditForm } from "./VideoEditForm";
import { useVideoData } from "@/hooks/use-video-data";
import { useVideoTranslation } from "@/hooks/use-video-translation";

export function VideoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    videoData,
    translations,
    isNewVideo,
    isLoading,
    videoMutation,
    handleVideoDataChange,
    handleTranslationChange,
  } = useVideoData(id);

  const { handleTranslate } = useVideoTranslation(translations, handleTranslationChange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    videoMutation.mutate();
  };

  if (!isNewVideo && isLoading) {
    return <div>Loading...</div>;
  }

  if (!isNewVideo && id === ":id") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Invalid video ID</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => navigate("/admin")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 group"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Videos
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isNewVideo ? "Add New Video" : "Edit Video"}</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoEditForm
            videoData={videoData}
            translations={translations}
            isNewVideo={isNewVideo}
            isPending={videoMutation.isPending}
            onVideoDataChange={handleVideoDataChange}
            onTranslationChange={handleTranslationChange}
            onTranslate={handleTranslate}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
