
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, Calendar as CalendarIcon, Clock, Smile } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Mock Facebook pages data
const facebookPages = [
  { id: "1", name: "การตลาด บี.เค. หลัก", followers: "15.2K" },
  { id: "2", name: "BK Marketing Solutions", followers: "8.7K" },
  { id: "3", name: "บริการรับทำโฆษณา", followers: "12.5K" },
  { id: "4", name: "เว็บไซต์และการตลาด", followers: "6.3K" },
];

const emojiOptions = ["😊", "😍", "🎉", "🔥", "💪", "👍", "❤️", "🚀", "💼", "📈"];

interface PostCreatorProps {
  postData: any;
  setPostData: (data: any) => void;
}

const PostCreator = ({ postData, setPostData }: PostCreatorProps) => {
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState("");
  const { toast } = useToast();

  const handlePageSelection = (pageId: string, checked: boolean) => {
    if (checked) {
      setPostData({
        ...postData,
        selectedPages: [...postData.selectedPages, pageId],
      });
    } else {
      setPostData({
        ...postData,
        selectedPages: postData.selectedPages.filter((id: string) => id !== pageId),
      });
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(event.target.files || []);
    
    files.forEach((file) => {
      // Simulate image compression for demo
      if (type === 'image' && file.size > 1024 * 1024) { // 1MB
        toast({
          title: "กำลังย่อขนาดรูปภาพ",
          description: `กำลังประมวลผล ${file.name}`,
        });
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia = {
          id: Date.now() + Math.random(),
          type,
          url: e.target?.result as string,
          name: file.name,
        };
        
        setPostData({
          ...postData,
          media: [...postData.media, newMedia],
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (mediaId: number) => {
    setPostData({
      ...postData,
      media: postData.media.filter((item: any) => item.id !== mediaId),
    });
  };

  const addEmoji = (emoji: string) => {
    setPostData({
      ...postData,
      text: postData.text + emoji,
    });
  };

  const handleSchedule = () => {
    if (scheduledDate && scheduledTime) {
      const [hours, minutes] = scheduledTime.split(':');
      const scheduleDateTime = new Date(scheduledDate);
      scheduleDateTime.setHours(parseInt(hours), parseInt(minutes));
      
      setPostData({
        ...postData,
        scheduledTime: scheduleDateTime,
      });
      
      toast({
        title: "กำหนดเวลาโพสต์สำเร็จ",
        description: `จะโพสต์ในวันที่ ${format(scheduleDateTime, 'dd/MM/yyyy HH:mm', { locale: th })}`,
      });
    }
  };

  const handlePostNow = () => {
    if (postData.selectedPages.length === 0) {
      toast({
        title: "กรุณาเลือกเพจ",
        description: "กรุณาเลือกเพจที่ต้องการโพสต์อย่างน้อย 1 เพจ",
        variant: "destructive",
      });
      return;
    }
    
    if (!postData.text.trim() && postData.media.length === 0) {
      toast({
        title: "กรุณาเพิ่มเนื้อหา",
        description: "กรุณาเพิ่มข้อความหรือสื่อก่อนโพสต์",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "โพสต์สำเร็จ!",
      description: `โพสต์ไปยัง ${postData.selectedPages.length} เพจแล้ว`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Selection */}
      <div>
        <Label className="text-lg font-semibold mb-3 block">เลือกเพจที่ต้องการโพสต์</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {facebookPages.map((page) => (
            <div
              key={page.id}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <Checkbox
                id={`page-${page.id}`}
                checked={postData.selectedPages.includes(page.id)}
                onCheckedChange={(checked) =>
                  handlePageSelection(page.id, checked as boolean)
                }
              />
              <div className="flex-1">
                <Label htmlFor={`page-${page.id}`} className="font-medium cursor-pointer">
                  {page.name}
                </Label>
                <p className="text-sm text-gray-500">{page.followers} ผู้ติดตาม</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Upload */}
      <div>
        <Label className="text-lg font-semibold mb-3 block">เพิ่มสื่อ</Label>
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image size={16} />
              รูปภาพ
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video size={16} />
              วิดีโอ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMediaUpload(e, 'image')}
              className="mb-2"
            />
            <p className="text-sm text-gray-500">
              รองรับไฟล์: JPG, PNG, GIF (จะทำการย่อขนาดอัตโนมัติ)
            </p>
          </TabsContent>
          <TabsContent value="video">
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => handleMediaUpload(e, 'video')}
              className="mb-2"
            />
            <p className="text-sm text-gray-500">
              รองรับไฟล์: MP4, MOV, AVI (ขนาดไม่เกิน 100MB)
            </p>
          </TabsContent>
        </Tabs>

        {/* Media Preview */}
        {postData.media.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {postData.media.map((item: any) => (
              <div key={item.id} className="relative group">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-24 object-cover rounded-lg"
                    muted
                  />
                )}
                <button
                  onClick={() => removeMedia(item.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div>
        <Label htmlFor="post-text" className="text-lg font-semibold mb-3 block">
          เนื้อหาโพสต์
        </Label>
        <Textarea
          id="post-text"
          placeholder="เขียนข้อความที่ต้องการโพสต์..."
          value={postData.text}
          onChange={(e) => setPostData({ ...postData, text: e.target.value })}
          className="min-h-32 mb-3"
        />
        
        {/* Emoji Selector */}
        <div className="flex items-center gap-2 mb-3">
          <Smile size={20} className="text-gray-500" />
          <div className="flex gap-1">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="hover:bg-gray-100 p-1 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <Input
          placeholder="เพิ่มแฮชแท็ก เช่น #การตลาด #โฆษณา"
          value={postData.hashtags}
          onChange={(e) => setPostData({ ...postData, hashtags: e.target.value })}
        />
      </div>

      {/* Scheduling */}
      <div>
        <Label className="text-lg font-semibold mb-3 block">กำหนดเวลาโพสต์</Label>
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon size={16} />
                {scheduledDate ? format(scheduledDate, 'dd/MM/yyyy', { locale: th }) : 'เลือกวันที่'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <Input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-32"
            />
          </div>
          
          <Button onClick={handleSchedule} variant="outline">
            ตั้งเวลา
          </Button>
        </div>
        
        {postData.scheduledTime && (
          <p className="text-sm text-green-600 mt-2">
            กำหนดโพสต์: {format(postData.scheduledTime, 'dd/MM/yyyy HH:mm', { locale: th })}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handlePostNow} className="flex-1 bg-blue-600 hover:bg-blue-700">
          โพสต์ทันที
        </Button>
        <Button variant="outline" className="flex-1">
          บันทึกร่าง
        </Button>
      </div>
    </div>
  );
};

export default PostCreator;
