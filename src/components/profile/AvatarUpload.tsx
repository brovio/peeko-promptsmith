import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
}

export function AvatarUpload({ avatarUrl, onAvatarChange }: AvatarUploadProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 400,
      useWebWorker: true
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      // Compress the image before upload
      const compressedFile = await compressImage(file);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const { data: imageUrl } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      onAvatarChange(imageUrl.publicUrl);
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error uploading photo",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 flex items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback>
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          className="max-w-xs"
          disabled={loading}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Upload a profile photo
        </p>
      </div>
    </div>
  );
}