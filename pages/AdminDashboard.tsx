import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, FileOutput, MousePointerClick, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui';

const data = [
  { name: 'Jan', users: 400, portfolios: 240, views: 2400 },
  { name: 'Feb', users: 300, portfolios: 139, views: 2210 },
  { name: 'Mar', users: 200, portfolios: 980, views: 2290 },
  { name: 'Apr', users: 278, portfolios: 390, views: 2000 },
  { name: 'May', users: 189, portfolios: 480, views: 2181 },
  { name: 'Jun', users: 239, portfolios: 380, views: 2500 },
  { name: 'Jul', users: 349, portfolios: 430, views: 2100 },
];

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
    <Card className="flex items-center justify-between">
        <div>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-semibold text-text-main mt-2 tracking-tight">{value}</h3>
            <span className="text-success text-xs flex items-center mt-2 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
            </span>
        </div>
        <div className={`p-3 rounded-full bg-${color}-500/10`}>
            <Icon className={`w-6 h-6 text-${color}-600`} strokeWidth={1.5} />
        </div>
    </Card>
);

export const AdminDashboard = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold text-text-main tracking-tight">Platform Overview</h1>
        <p className="text-text-secondary mt-1">Real-time performance metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="12,345" trend="+12%" icon={Users} color="indigo" />
        <StatCard title="Portfolios" value="8,234" trend="+5.2%" icon={FileOutput} color="purple" />
        <StatCard title="Total Views" value="1.2M" trend="+24%" icon={MousePointerClick} color="sky" />
        <StatCard title="Templates" value="14" trend="+1" icon={TrendingUp} color="emerald" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-main">User Growth</h3>
                <p className="text-text-secondary text-sm">New registered users over time</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#007AFF" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                        <XAxis dataKey="name" stroke="#86868B" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#86868B" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E8ED', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#1D1D1F' }}
                            itemStyle={{ color: '#007AFF' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#007AFF" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-main">Template Usage</h3>
                <p className="text-text-secondary text-sm">Most popular styles selected</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                        <XAxis dataKey="name" stroke="#86868B" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E8ED', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#1D1D1F' }}
                             cursor={{fill: '#F5F5F7'}}
                        />
                        <Bar dataKey="portfolios" fill="#007AFF" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
    </div>
  );
};