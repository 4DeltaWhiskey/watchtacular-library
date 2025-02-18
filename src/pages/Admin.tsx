
import { Video, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VideoManagement } from "@/components/admin/VideoManagement";
import { SettingsManagement } from "@/components/admin/SettingsManagement";

type Tab = "videos" | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("videos");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="flex gap-4">
        <Button
          variant={activeTab === "videos" ? "default" : "outline"}
          onClick={() => setActiveTab("videos")}
        >
          <Video className="mr-2 h-4 w-4" />
          Videos
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "outline"}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6">
        {activeTab === "videos" && <VideoManagement />}
        {activeTab === "settings" && <SettingsManagement />}
      </div>
    </div>
  );
}
