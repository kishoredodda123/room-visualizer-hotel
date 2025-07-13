
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 mb-8 h-auto p-1">
              <TabsTrigger value="room-status" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Booking Status</span>
                <span className="sm:hidden">Status</span>
              </TabsTrigger>
              <TabsTrigger value="room-overview" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
                <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Room Overview</span>
                <span className="sm:hidden">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="room-grid" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
                <Grid3X3 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Room Grid</span>
                <span className="sm:hidden">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="qr-search" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
                <Search className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">QR Search</span>
                <span className="sm:hidden">Search</span>
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
