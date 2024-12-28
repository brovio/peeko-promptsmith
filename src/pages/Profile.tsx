import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AvatarUpload } from "@/components/profile/AvatarUpload";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      
      if (data.avatar_url) {
        const { data: imageUrl } = supabase.storage
          .from('profile_photos')
          .getPublicUrl(data.avatar_url);
        setAvatarUrl(imageUrl.publicUrl);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        twitter_url: profile.twitter_url,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        website_url: profile.website_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-background text-foreground">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload 
            avatarUrl={avatarUrl} 
            onAvatarChange={(url) => setAvatarUrl(url)} 
          />
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Username
              </label>
              <Input
                type="text"
                value={profile?.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Full Name
              </label>
              <Input
                type="text"
                value={profile?.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Bio
              </label>
              <Textarea
                value={profile?.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Twitter URL
              </label>
              <Input
                type="url"
                value={profile?.twitter_url || ''}
                onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                GitHub URL
              </label>
              <Input
                type="url"
                value={profile?.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                LinkedIn URL
              </label>
              <Input
                type="url"
                value={profile?.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Website URL
              </label>
              <Input
                type="url"
                value={profile?.website_url || ''}
                onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                className="bg-background text-foreground"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}