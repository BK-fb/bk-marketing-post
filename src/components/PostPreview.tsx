
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PostPreviewProps {
  postData: any;
}

const PostPreview = ({ postData }: PostPreviewProps) => {
  const selectedPageNames = [
    "การตลาด บี.เค. หลัก",
    "BK Marketing Solutions", 
    "บริการรับทำโฆษณา",
    "เว็บไซต์และการตลาด"
  ].filter((_, index) => postData.selectedPages.includes((index + 1).toString()));

  const formatText = (text: string) => {
    if (!text) return "";
    
    // Convert hashtags to blue links
    return text.split(' ').map((word, index) => {
      if (word.startsWith('#')) {
        return <span key={index} className="text-blue-600 hover:underline cursor-pointer">{word} </span>;
      }
      return word + ' ';
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 mb-4">
        จะโพสต์ไปยัง {selectedPageNames.length} เพจ
      </h3>
      
      {selectedPageNames.length > 0 && (
        <div className="space-y-4">
          {selectedPageNames.slice(0, 2).map((pageName, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              {/* Facebook Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {pageName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{pageName}</p>
                    <p className="text-xs text-gray-500">
                      {postData.scheduledTime 
                        ? format(postData.scheduledTime, 'dd/MM/yyyy HH:mm', { locale: th })
                        : 'ตอนนี้'
                      } · 🌐
                    </p>
                  </div>
                </div>
                <MoreHorizontal size={20} className="text-gray-400" />
              </div>

              {/* Post Content */}
              {(postData.text || postData.hashtags) && (
                <div className="mb-3">
                  <p className="text-sm leading-relaxed">
                    {formatText(postData.text)}
                    {postData.hashtags && (
                      <span className="text-blue-600">
                        {postData.hashtags.split(' ').map((tag: string, i: number) => (
                          <span key={i} className="hover:underline cursor-pointer">{tag} </span>
                        ))}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Media Preview */}
              {postData.media.length > 0 && (
                <div className="mb-3">
                  {postData.media.length === 1 ? (
                    <div className="rounded-lg overflow-hidden">
                      {postData.media[0].type === 'image' ? (
                        <img
                          src={postData.media[0].url}
                          alt="Preview"
                          className="w-full max-h-64 object-cover"
                        />
                      ) : (
                        <video
                          src={postData.media[0].url}
                          className="w-full max-h-64 object-cover"
                          controls
                        />
                      )}
                    </div>
                  ) : postData.media.length === 2 ? (
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                      {postData.media.slice(0, 2).map((item: any, i: number) => (
                        <div key={i}>
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={`Preview ${i + 1}`}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-32 object-cover"
                              muted
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                      {postData.media.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className={i === 0 ? "row-span-2" : ""}>
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={`Preview ${i + 1}`}
                              className={`w-full object-cover ${i === 0 ? "h-full" : "h-16"}`}
                            />
                          ) : (
                            <video
                              src={item.url}
                              className={`w-full object-cover ${i === 0 ? "h-full" : "h-16"}`}
                              muted
                            />
                          )}
                          {i === 2 && postData.media.length > 3 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold">
                              +{postData.media.length - 3}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Facebook Interaction Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <Heart size={16} />
                    <span className="text-sm">ถูกใจ</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-sm">แสดงความคิดเห็น</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <Share size={16} />
                    <span className="text-sm">แชร์</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {selectedPageNames.length > 2 && (
            <div className="text-center text-sm text-gray-500 py-2 border rounded-lg bg-gray-50">
              + อีก {selectedPageNames.length - 2} เพจ
            </div>
          )}
        </div>
      )}
      
      {selectedPageNames.length === 0 && (
        <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p>กรุณาเลือกเพจที่ต้องการโพสต์</p>
        </div>
      )}
    </div>
  );
};

export default PostPreview;
