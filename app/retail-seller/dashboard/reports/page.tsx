'use client';

import { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, TrendingUp, Package, PoundSterling } from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last30');
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerateReport = (reportType: string) => {
    setGenerating(reportType);
    // Simulate report generation
    setTimeout(() => {
      setGenerating(null);
      alert(`${reportType} report generated! Download will start automatically.`);
    }, 1500);
  };

  const reports = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Detailed breakdown of all sales, including items, prices, and customer info',
      icon: PoundSterling,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Current stock levels, low stock alerts, and product performance',
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'performance',
      title: 'Performance Report',
      description: 'Views, conversion rates, and trending products analysis',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'tax',
      title: 'Tax Report',
      description: 'VAT summary and transaction details for accounting purposes',
      icon: FileSpreadsheet,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="mt-2 text-foreground/60">Generate and download detailed business reports</p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 rounded-lg border border-accent-grey/20 bg-white p-4">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-foreground/60" />
          <span className="text-sm font-medium text-foreground">Date Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-accent-grey/20 px-3 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="thisMonth">This month</option>
            <option value="lastMonth">Last month</option>
            <option value="thisYear">This year</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="rounded-lg border border-accent-grey/20 bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`rounded-lg p-3 ${report.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                    <p className="mt-1 text-sm text-foreground/60">{report.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleGenerateReport(report.title)}
                  disabled={generating === report.title}
                  className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>{generating === report.title ? 'Generating...' : 'Download CSV'}</span>
                </button>
                <button
                  onClick={() => handleGenerateReport(report.title + ' PDF')}
                  disabled={generating === report.title + ' PDF'}
                  className="flex items-center space-x-2 rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduled Reports */}
      <div className="mt-8 rounded-lg border border-accent-grey/20 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Scheduled Reports</h2>
        <p className="mb-4 text-sm text-foreground/60">
          Set up automatic report generation and delivery to your email.
        </p>
        <div className="rounded-lg border border-dashed border-accent-grey/30 bg-accent-cyan-light/30 p-8 text-center">
          <FileSpreadsheet className="mx-auto h-10 w-10 text-accent-grey" />
          <p className="mt-2 text-sm text-foreground/60">No scheduled reports configured</p>
          <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer">
            Set Up Scheduled Report
          </button>
        </div>
      </div>
    </div>
  );
}
