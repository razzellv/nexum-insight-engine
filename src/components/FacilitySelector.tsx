import React, { useState, useEffect } from 'react';
import { Building2, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useEquipment } from '@/contexts/EquipmentContext';
import { toast } from '@/hooks/use-toast';

interface Facility {
  id: string;
  name: string;
  address: string | null;
  tier: string;
  max_equipment_included: number;
  sensor_enabled: boolean;
}

const TIER_INFO = {
  starter: { label: 'Starter', equipment: 5, sensors: false },
  professional: { label: 'Professional', equipment: 15, sensors: true },
  enterprise: { label: 'Enterprise', equipment: 'Unlimited', sensors: true },
};

export const FacilitySelector = () => {
  const { currentFacility, setCurrentFacility } = useEquipment();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: '',
    address: '',
    tier: 'starter',
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching facilities:', error);
      return;
    }

    setFacilities(data || []);
    
    // Auto-select first facility if none selected
    if (data && data.length > 0 && !currentFacility) {
      setCurrentFacility(data[0]);
    }
  };

  const handleCreateFacility = async () => {
    if (!newFacility.name.trim()) {
      toast({
        title: "Error",
        description: "Facility name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('register-facility', {
        body: newFacility,
      });

      if (error) throw error;

      toast({
        title: "Facility Registered",
        description: data.message,
      });

      setCurrentFacility(data.data);
      setIsDialogOpen(false);
      setNewFacility({ name: '', address: '', tier: 'starter' });
      fetchFacilities();

    } catch (error) {
      console.error('Error creating facility:', error);
      toast({
        title: "Error",
        description: "Failed to create facility",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFacility = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (facility) {
      setCurrentFacility(facility);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Facility Registry</span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Facility</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Facility Name *</Label>
                <Input
                  id="name"
                  placeholder="Main Building"
                  value={newFacility.name}
                  onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Industrial Ave"
                  value={newFacility.address}
                  onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tier">Subscription Tier</Label>
                <Select
                  value={newFacility.tier}
                  onValueChange={(value) => setNewFacility({ ...newFacility, tier: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">
                      Starter (5 equipment, no sensors)
                    </SelectItem>
                    <SelectItem value="professional">
                      Professional (15 equipment, sensors enabled)
                    </SelectItem>
                    <SelectItem value="enterprise">
                      Enterprise (Unlimited, all features)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreateFacility} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating...' : 'Register Facility'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {facilities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No facilities registered. Add a facility to start registering equipment.
        </p>
      ) : (
        <div className="space-y-2">
          <Select
            value={currentFacility?.id || ''}
            onValueChange={handleSelectFacility}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a facility" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.name} ({TIER_INFO[facility.tier as keyof typeof TIER_INFO]?.label || facility.tier})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentFacility && (
            <div className="mt-3 p-3 bg-muted/50 rounded-md text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Tier:</span>
                <span className="font-medium capitalize">{currentFacility.tier}</span>
                <span className="text-muted-foreground">Max Equipment:</span>
                <span className="font-medium">{currentFacility.max_equipment_included}</span>
                <span className="text-muted-foreground">Sensors:</span>
                <span className="font-medium">{currentFacility.sensor_enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
