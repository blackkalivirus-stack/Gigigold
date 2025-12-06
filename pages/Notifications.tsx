
import React from 'react';
import { Header } from '../components/Header';
import { Bell, TrendingUp, CheckCircle, ShieldCheck, Ticket } from '../components/ui/Icons';

export const Notifications: React.FC = () => {
  // Mock Notifications Data
  const notifications = [
    {
      id: 1,
      title: "Gold Price Alert",
      message: "Gold prices are up by 0.72% today! Good time to sell?",
      time: "2 hours ago",
      type: "PRICE",
      read: false
    },
    {
      id: 2,
      title: "SIP Successful",
      message: "Your monthly gold SIP of ₹500 was processed successfully.",
      time: "1 day ago",
      type: "SUCCESS",
      read: true
    },
    {
      id: 3,
      title: "Welcome to PMJ Jewels",
      message: "Thanks for joining! Complete your KYC to unlock higher limits.",
      time: "2 days ago",
      type: "INFO",
      read: true
    },
    {
      id: 4,
      title: "Voucher Generated",
      message: "Your Tanishq voucher for ₹2000 is ready to use.",
      time: "1 week ago",
      type: "REDEEM",
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'PRICE': return <TrendingUp size={16} className="text-gold-600" />;
      case 'SUCCESS': return <CheckCircle size={16} className="text-green-600" />;
      case 'REDEEM': return <Ticket size={16} className="text-purple-600" />;
      default: return <ShieldCheck size={16} className="text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'PRICE': return 'bg-gold-50 border-gold-100';
      case 'SUCCESS': return 'bg-green-50 border-green-100';
      case 'REDEEM': return 'bg-purple-50 border-purple-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Notifications" showBack />
      
      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-24">
         <div className="space-y-4">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-4 rounded-2xl border transition-all ${notif.read ? 'bg-white border-slate-100' : 'bg-white border-gold-200 shadow-sm'}`}>
                 <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getBgColor(notif.type)}`}>
                       {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                       </div>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          {notif.message}
                       </p>
                    </div>
                 </div>
              </div>
            ))}

            <div className="text-center pt-8">
               <p className="text-xs text-slate-400">No older notifications</p>
            </div>
         </div>
      </div>
    </div>
  );
};