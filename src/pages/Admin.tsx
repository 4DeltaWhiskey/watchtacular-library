
import { VideoManagement } from "@/components/admin/VideoManagement";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Admin() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <VideoManagement />
    </div>
  );
}
