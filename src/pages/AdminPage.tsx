
import { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Grid3X3, Search } from 'lucide-react';
import RoomStatusView from '@/components/admin/RoomStatusView';
import RoomOverview from '@/components/admin/RoomOverview';
import RoomAllocationGrid from '@/components/admin/RoomAllocationGrid';
import QRSearchView from '@/components/admin/QRSearchView';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('room-status');

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground">Manage rooms and bookings efficiently</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="room-status" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Booking Status
              </TabsTrigger>
              <TabsTrigger value="room-overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Room Overview
              </TabsTrigger>
              <TabsTrigger value="room-grid" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Room Grid
              </TabsTrigger>
              <TabsTrigger value="qr-search" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                QR Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="room-status">
              <RoomStatusView />
            </TabsContent>

            <TabsContent value="room-overview">
              <RoomOverview />
            </TabsContent>

            <TabsContent value="room-grid">
              <RoomAllocationGrid />
            </TabsContent>

            <TabsContent value="qr-search">
              <QRSearchView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
