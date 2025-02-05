
import { useState } from "react";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Comment } from "@/types/video";
import { FormattedMessage } from "react-intl";

interface VideoCommentsProps {
  initialComments: Comment[];
}

export const VideoComments = ({ initialComments }: VideoCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: <FormattedMessage id="app.error" defaultMessage="Error" />,
        description: <FormattedMessage id="app.pleaseEnterComment" defaultMessage="Please enter a comment" />,
        variant: "destructive",
      });
      return;
    }

    const comment: Comment = {
      id: comments.length + 1,
      author: "You",
      content: newComment,
      likes: 0,
      timestamp: "Just now",
    };

    setComments([comment, ...comments]);
    setNewComment("");
    toast({
      title: <FormattedMessage id="app.success" defaultMessage="Success" />,
      description: <FormattedMessage id="app.commentAdded" defaultMessage="Comment added successfully" />,
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
        <FormattedMessage id="app.comments" defaultMessage="Comments" />
      </h2>
      
      <div className="space-y-4 mb-8">
        <Textarea
          placeholder={<FormattedMessage id="app.addComment" defaultMessage="Add a comment..." /> as unknown as string}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleCommentSubmit}>
          <FormattedMessage id="app.postComment" defaultMessage="Post Comment" />
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

