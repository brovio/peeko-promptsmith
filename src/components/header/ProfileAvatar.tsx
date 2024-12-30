import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export function ProfileAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user");

        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.avatar_url) {
          const { data: imageUrl } = supabase.storage
            .from('profile_photos')
            .getPublicUrl(data.avatar_url);
          setAvatarUrl(imageUrl.publicUrl);
        }
      } catch (error) {
        console.error('Error loading avatar:', error);
      }
    }

    getProfile();
  }, []);

  return (
    <Avatar>
      <AvatarImage src={avatarUrl || ''} />
      <AvatarFallback>
        <User className="h-8 w-8 text-[hsl(142,76%,36%)]" />
      </AvatarFallback>
    </Avatar>
  );
}