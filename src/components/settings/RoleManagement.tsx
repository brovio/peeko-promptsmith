import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ModelSelector } from "@/components/ModelSelector";
import { Plus, Trash2, Settings2 } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  role_type: 'admin' | 'basic' | 'premium';
  is_active: boolean;
}

export function RoleManagement() {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRoleType, setNewRoleType] = useState<'basic' | 'premium' | 'admin'>('basic');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch roles
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_definitions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Role[];
    },
  });

  // Fetch models for selected role
  const { data: roleModels = [] } = useQuery({
    queryKey: ['role-models', selectedRole],
    queryFn: async () => {
      if (!selectedRole) return [];
      const { data, error } = await supabase
        .from('role_available_models')
        .select('model_id')
        .eq('role_id', selectedRole);
      
      if (error) throw error;
      return data.map(m => m.model_id);
    },
    enabled: !!selectedRole,
  });

  // Create role mutation
  const createRole = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('role_definitions')
        .insert([
          {
            name: newRoleName,
            description: newRoleDescription,
            role_type: newRoleType,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setNewRoleName("");
      setNewRoleDescription("");
      toast({
        title: "Success",
        description: "Role created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create role: " + error.message,
      });
    },
  });

  // Add model to role mutation
  const addModelToRole = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('role_available_models')
        .insert([
          {
            role_id: selectedRole,
            model_id: selectedModel,
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-models'] });
      toast({
        title: "Success",
        description: "Model added to role successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add model: " + error.message,
      });
    },
  });

  // Remove model from role mutation
  const removeModelFromRole = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from('role_available_models')
        .delete()
        .eq('role_id', selectedRole)
        .eq('model_id', modelId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-models'] });
      toast({
        title: "Success",
        description: "Model removed from role successfully",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Create New Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Role Name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Role Description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
              />
            </div>
            <div>
              <Select value={newRoleType} onValueChange={(value: 'basic' | 'premium' | 'admin') => setNewRoleType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => createRole.mutate()}
              disabled={!newRoleName || createRole.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Role Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedRole || ''} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role to manage" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRole && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ModelSelector
                      selectedModel={selectedModel}
                      onModelSelect={setSelectedModel}
                    />
                  </div>
                  <Button
                    onClick={() => addModelToRole.mutate()}
                    disabled={!selectedModel || addModelToRole.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Model
                  </Button>
                </div>

                <div className="space-y-2">
                  {roleModels.map((modelId) => (
                    <div key={modelId} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <span>{modelId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModelFromRole.mutate(modelId)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}