'use client';

import { useState } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { setFile(e.target.files[0]); setResult(null); } };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => { setResult({ success: 150, failed: 5, errors: ['Row 23: Invalid IMEI format', 'Row 67: Missing required field "price"', 'Row 89: Duplicate product SKU', 'Row 112: Invalid condition value', 'Row 145: Stock quantity exceeds limit'] }); setUploading(false); }, 2000);
  };

  const handleDownloadCSV = () => {
    const link = document.createElement('a');
    link.href = '/templates/wholesale-products-template.csv';
    link.download = 'wholesale-products-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = () => {
    // Generate Excel-compatible CSV with BOM for proper encoding
    const csvContent = `title,description,price,stock,category,brand,model,IMEI,condition,grade,storage,color,networkStatus,networkLock,accessoryType,compatibility,oem,accessoryBrand,serviceType,provider,validity,serviceNetwork
"iPhone 15 Pro 256GB - Blue","Excellent condition iPhone 15 Pro with 256GB storage. Grade A device.",899.99,10,handset,Apple,iPhone 15 Pro,123456789012345,used,A,256GB,Blue,unlocked,,,,,,,,
"Samsung Galaxy S24 Ultra 512GB","Brand new Samsung Galaxy S24 Ultra. Factory sealed.",1199.99,5,handset,Samsung,Galaxy S24 Ultra,987654321098765,new,A,512GB,Black,unlocked,,,,,,,,
"iPhone 14 Case - Clear","Premium clear case for iPhone 14 series",12.99,100,accessory,,,,,,,,,case,"iPhone 14,iPhone 14 Pro",aftermarket,Generic,,,,
"EE Top Up £20","EE network top up voucher worth £20",20.00,50,service_voucher,,,,,,,,,,,,,top_up,EE,30 days,EE`;
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wholesale-products-template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-3xl font-bold text-foreground">Bulk Upload</h1><p className="mt-2 text-foreground/60">Upload multiple wholesale products at once using CSV or Excel files</p></div>
      <div className="mb-6 rounded-lg border border-accent-grey/20 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Step 1: Download Template</h2>
        <p className="mb-4 text-sm text-foreground/60">Download our template file and fill in your product details. Make sure to follow the format guidelines.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownloadCSV} className="flex items-center space-x-2 rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"><Download className="h-4 w-4" /><span>Download CSV Template</span></button>
          <button onClick={handleDownloadExcel} className="flex items-center space-x-2 rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"><Download className="h-4 w-4" /><span>Download Excel Template</span></button>
        </div>
      </div>
      <div className="mb-6 rounded-lg border border-accent-grey/20 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Step 2: Upload Your File</h2>
        <div className="mb-4">
          <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-accent-grey/30 bg-accent-cyan-light/30 p-8 transition-colors hover:border-primary hover:bg-accent-cyan-light">
            <FileSpreadsheet className="mb-3 h-12 w-12 text-primary" />
            <span className="text-sm font-medium text-foreground">{file ? file.name : 'Click to upload or drag and drop'}</span>
            <span className="mt-1 text-xs text-foreground/60">CSV or Excel files (max 50MB for wholesale)</span>
            <input id="file-upload" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        {file && (
          <div className="flex items-center justify-between rounded-lg border border-accent-grey/20 bg-accent-cyan-light/50 p-3">
            <div className="flex items-center space-x-3"><FileSpreadsheet className="h-5 w-5 text-primary" /><div><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-foreground/60">{(file.size / 1024).toFixed(1)} KB</p></div></div>
            <button onClick={handleUpload} disabled={uploading} className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 cursor-pointer"><Upload className="h-4 w-4" /><span>{uploading ? 'Uploading...' : 'Upload Products'}</span></button>
          </div>
        )}
      </div>
      {result && (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Upload Results</h2>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-4"><div className="flex items-center space-x-2"><CheckCircle2 className="h-5 w-5 text-green-600" /><span className="text-sm font-medium text-green-800">Successfully Imported</span></div><p className="mt-2 text-2xl font-bold text-green-700">{result.success}</p></div>
            <div className="rounded-lg bg-red-50 p-4"><div className="flex items-center space-x-2"><AlertCircle className="h-5 w-5 text-red-600" /><span className="text-sm font-medium text-red-800">Failed</span></div><p className="mt-2 text-2xl font-bold text-red-700">{result.failed}</p></div>
          </div>
          {result.errors.length > 0 && (<div><h3 className="mb-2 text-sm font-semibold text-foreground">Errors:</h3><ul className="space-y-1">{result.errors.map((error, idx) => (<li key={idx} className="text-sm text-red-600">• {error}</li>))}</ul></div>)}
        </div>
      )}
      <div className="mt-6 rounded-lg border border-accent-grey/20 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Upload Guidelines</h2>
        <ul className="space-y-2 text-sm text-foreground/70">
          <li>• Maximum 2000 products per upload (wholesale limit)</li>
          <li>• Required fields: Title, Price, Stock, Category, Condition</li>
          <li>• For handsets: Brand, Model, IMEI, Storage, Grade are required</li>
          <li>• Prices should be in GBP (£) without currency symbol</li>
          <li>• Images should be valid URLs (up to 10 per product)</li>
          <li>• IMEI numbers must be unique and 15 digits</li>
          <li>• Bulk pricing tiers can be specified in separate columns</li>
        </ul>
      </div>
    </div>
  );
}
