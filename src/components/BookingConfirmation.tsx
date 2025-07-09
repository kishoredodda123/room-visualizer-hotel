
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Phone, Mail, User, CreditCard, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface BookingConfirmationProps {
  booking: {
    confirmation_code: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    check_in_date: string;
    check_out_date: string;
    total_amount: number;
    room_type: string;
    room_number?: string;
    special_requests?: string;
    qr_data: string;
  };
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  const handleDownload = () => {
    // Create a printable version
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hotel Booking Confirmation',
        text: `Booking confirmed! Confirmation code: ${booking.confirmation_code}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-hotel-gold/20 bg-white">
        <CardHeader className="text-center bg-gradient-to-r from-hotel-gold-light to-white border-b border-hotel-gold/20">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl text-hotel-brown">Booking Confirmed!</CardTitle>
          <p className="text-muted-foreground">Your reservation has been successfully confirmed</p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Confirmation Code */}
          <div className="text-center mb-6 p-6 bg-gradient-to-r from-hotel-gold-light/50 to-hotel-gold-light/20 rounded-xl border border-hotel-gold/20">
            <h3 className="font-bold text-hotel-brown mb-2 text-lg">Confirmation Code</h3>
            <div className="text-4xl font-bold text-hotel-gold tracking-wider">{booking.confirmation_code}</div>
            <p className="text-sm text-muted-foreground mt-2">Keep this code for check-in</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Guest Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-hotel-brown text-lg mb-4">Guest Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-hotel-gold" />
                  <span>{booking.guest_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-hotel-gold" />
                  <span className="text-sm">{booking.guest_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-hotel-gold" />
                  <span>{booking.guest_phone}</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-hotel-brown text-lg mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-hotel-gold" />
                  <span>{booking.room_type}{booking.room_number && ` - Room ${booking.room_number}`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-hotel-gold" />
                  <span className="text-sm">Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-hotel-gold" />
                  <span className="text-sm">Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-hotel-gold" />
                  <span className="font-semibold text-lg">₹{booking.total_amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-hotel-brown mb-2">Special Requests</h4>
              <p className="text-sm">{booking.special_requests}</p>
            </div>
          )}

          {/* QR Code */}
          <div className="flex flex-col items-center mb-6 p-6 bg-white border-2 border-dashed border-hotel-gold/30 rounded-xl">
            <h4 className="font-semibold text-hotel-brown mb-4">QR Code for Check-in</h4>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG 
                value={booking.qr_data} 
                size={150}
                level="M"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Show this QR code at the hotel reception for quick check-in
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <Badge className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white">
              CONFIRMED & PAID
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="flex-1 border-hotel-gold/30 text-hotel-brown hover:bg-hotel-gold/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download/Print
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="flex-1 border-hotel-gold/30 text-hotel-brown hover:bg-hotel-gold/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1 bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
