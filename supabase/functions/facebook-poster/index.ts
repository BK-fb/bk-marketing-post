
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FACEBOOK_ACCESS_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { pageId, message, mediaUrl, mediaType } = body;

    if (!pageId || (!message && !mediaUrl)) {
      return new Response(JSON.stringify({ error: "ต้องระบุ pageId และ message หรือ mediaUrl" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let fbApiUrl = `https://graph.facebook.com/${pageId}/feed`;
    let params: Record<string, string> = { access_token: FACEBOOK_ACCESS_TOKEN };
    let postPayload: Record<string, string> = {};

    if (mediaUrl && mediaType === "image") {
      // โพสรูปพร้อมข้อความ
      fbApiUrl = `https://graph.facebook.com/${pageId}/photos`;
      postPayload = {
        url: mediaUrl,
        message: message ?? "",
        access_token: FACEBOOK_ACCESS_TOKEN,
      };
    } else if (mediaUrl && mediaType === "video") {
      // โพสต์วิดีโอพร้อมข้อความ
      fbApiUrl = `https://graph.facebook.com/${pageId}/videos`;
      postPayload = {
        file_url: mediaUrl,
        description: message ?? "",
        access_token: FACEBOOK_ACCESS_TOKEN,
      };
    } else {
      // โพสต์ข้อความเท่านั้น
      postPayload = {
        message,
        access_token: FACEBOOK_ACCESS_TOKEN,
      };
    }

    // POST ไปยัง Facebook
    const fbRes = await fetch(fbApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postPayload),
    });

    const result = await fbRes.json();
    if (!fbRes.ok) {
      console.error("Facebook API Error:", result);
      return new Response(JSON.stringify({ error: result.error?.message ?? "โพสต์ไม่สำเร็จ" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดที่ฝั่งเซิร์ฟเวอร์" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
