
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/LoginForm";
import PostCreator from "@/components/PostCreator";
import PostPreview from "@/components/PostPreview";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postData, setPostData] = useState({
    selectedPages: [],
    text: "",
    hashtags: "",
    media: [],
    scheduledTime: null,
  });

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">การตลาด บี.เค.</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Creator */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-600">สร้างโพสต์ Facebook</CardTitle>
              </CardHeader>
              <CardContent>
                <PostCreator postData={postData} setPostData={setPostData} />
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-blue-600">ตัวอย่างโพสต์</CardTitle>
              </CardHeader>
              <CardContent>
                <PostPreview postData={postData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
