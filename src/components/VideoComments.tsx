
import { useState } from "react";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Comment } from "@/types/video";
import { FormattedMessage, useIntl } from "react-intl";

interface VideoCommentsProps {
  initialComments: Comment[];
}

export const VideoComments = ({ initialComments }: VideoCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const intl = useIntl();

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: intl.formatMessage({ id: "app.error" }),
        description: intl.formatMessage({ id: "app.pleaseEnterComment" }),
        variant: "destructive",
      });
      return;
    }

    const comment: Comment = {
      id: comments.length + 1,
      author: intl.formatMessage({ id: "app.you" }),
      content: newComment,
      likes: 0,
      timestamp: intl.formatMessage({ id: "app.justNow" }),
    };

    setComments([comment, ...comments]);
    setNewComment("");
    toast({
      title: intl.formatMessage({ id: "app.success" }),
      description: intl.formatMessage({ id: "app.commentAdded" }),
    });
  };

  const handleLike = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        <FormattedMessage id="app.comments" />
      </h2>
      
      <div className="space-y-4 mb-8">
        <Textarea
          placeholder={intl.formatMessage({ id: "app.addComment" })}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleCommentSubmit}>
          <FormattedMessage id="app.postComment" />
        </Button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-secondary/20 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{comment.author}</h4>
                <p className="text-sm text-muted-foreground">{comment.timestamp}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleLike(comment.id)}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes}</span>
              </Button>
            </div>
            <p className="text-foreground/90">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
