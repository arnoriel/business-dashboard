import ExcelJS from 'exceljs';

export const generateDummyExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Laporan Penjualan');

  sheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Tanggal', key: 'tanggal', width: 15 },
    { header: 'Produk', key: 'produk', width: 25 },
    { header: 'Kategori', key: 'kategori', width: 15 },
    { header: 'Harga', key: 'harga', width: 15 },
    { header: 'Qty', key: 'qty', width: 10 },
    { header: 'Total', key: 'total', width: 15 },
    { header: 'Platform', key: 'platform', width: 15 },
  ];

  const rows = [
    { no: 1, tanggal: '2023-10-01', produk: 'Kopi Susu', kategori: 'Minuman', harga: 18000, qty: 10, total: 180000, platform: 'Shopee' },
    { no: 2, tanggal: '2023-10-01', produk: 'Roti Bakar', kategori: 'Makanan', harga: 15000, qty: 5, total: 75000, platform: 'Tokopedia' },
    { no: 3, tanggal: '2023-10-02', produk: 'Kopi Hitam', kategori: 'Minuman', harga: 10000, qty: 20, total: 200000, platform: 'Gojek' },
  ];

  rows.forEach(r => {
    const row = sheet.addRow(r);
    row.getCell('harga').numFmt = '"Rp "#,##0';
    row.getCell('total').numFmt = '"Rp "#,##0';
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAsExcel(buffer, 'Dummy_Data_Penjualan.xlsx');
};

export const readExcelFile = async (file: File): Promise<any[]> => {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);
  
  const worksheet = workbook.getWorksheet(1);
  const data: any[] = [];
  
  const headers: string[] = [];
  worksheet?.getRow(1).eachCell((cell) => {
    headers.push(cell.value?.toString() || "");
  });

  worksheet?.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber - 1]] = cell.value;
      });
      data.push(rowData);
    }
  });

  return data;
};

export const exportAnalysisToExcel = async (analysisHtml: string, rawData: any[], platform: string) => {
  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet('Ringkasan Analisa');

  // 1. SETTING COLUMN WIDTH (Perlebar kolom C untuk Omzet)
  summarySheet.getColumn('A').width = 25;
  summarySheet.getColumn('B').width = 90;
  summarySheet.getColumn('C').width = 25;

  // 2. PARSING HTML KE PLAIN TEXT (DENGAN LINE BREAKS)
  const cleanText = analysisHtml
    .replace(/<h3[^>]*>/g, '\n\n')
    .replace(/<\/h3>/g, '\n')
    .replace(/<p[^>]*>/g, '\n')
    .replace(/<\/p>/g, '\n')
    .replace(/<li>/g, '• ')
    .replace(/<\/li>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\n\s*\n/g, '\n\n') // Menghapus double space antar baris
    .trim();

  // 3. HEADER SECTION
  summarySheet.addRow(['PLATFORM', platform]).font = { bold: true };
  summarySheet.addRow(['TANGGAL ANALISA', new Date().toLocaleString()]);
  summarySheet.addRow([]);

  // 4. HASIL ANALISA AI (ADJUST TINGGI BARIS)
  const analysisTitleRow = summarySheet.addRow(['HASIL ANALISA AI']);
  analysisTitleRow.font = { bold: true, size: 12 };
  
  const analysisRow = summarySheet.addRow(['', cleanText]);
  const analysisCell = analysisRow.getCell(2);
  
  analysisCell.alignment = { wrapText: true, vertical: 'top' };
  
  // Hitung perkiraan tinggi baris berdasarkan jumlah karakter dan line break
  // Rata-rata 100 karakter per baris di lebar kolom 90
  const lineBreaks = (cleanText.match(/\n/g) || []).length;
  const estimatedLines = Math.ceil(cleanText.length / 100) + lineBreaks;
  analysisRow.height = estimatedLines * 15; // 15 adalah standar tinggi baris per baris teks

  summarySheet.addRow([]);

  // 5. SUMMARY TABLE
  summarySheet.addRow(['RINGKASAN DATA TRANSAKSI (TOP 5)']).font = { bold: true };
  const tableHeader = summarySheet.addRow(['Nama Produk', 'Total Qty', 'Total Omzet']);
  
  tableHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    cell.alignment = { horizontal: 'center' };
  });

  const summaryMap = new Map();
  let grandTotal = 0;

  rawData.forEach(item => {
    const name = item.Produk || item.produk || 'Unknown';
    const qty = Number(item.Qty || item.qty || 0);
    const total = Number(item.Total || item.total || 0);
    grandTotal += total;

    if (summaryMap.has(name)) {
      const existing = summaryMap.get(name);
      summaryMap.set(name, { qty: existing.qty + qty, total: existing.total + total });
    } else {
      summaryMap.set(name, { qty, total });
    }
  });

  const sortedSummary = Array.from(summaryMap.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  sortedSummary.forEach(([name, val]) => {
    const row = summarySheet.addRow([name, val.qty, val.total]);
    row.getCell(3).numFmt = '"Rp "#,##0'; // Format IDR
  });

  const footerRow = summarySheet.addRow(['GRAND TOTAL', '', grandTotal]);
  footerRow.font = { bold: true };
  footerRow.getCell(3).numFmt = '"Rp "#,##0'; // Format IDR
  footerRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

  // 6. SHEET 2: DATA SUMBER LENGKAP
  const dataSheet = workbook.addWorksheet('Data Sumber Lengkap');
  if (rawData.length > 0) {
    const keys = Object.keys(rawData[0]);
    dataSheet.columns = keys.map(k => ({ header: k.toUpperCase(), key: k, width: 20 }));
    
    rawData.forEach(item => {
      const row = dataSheet.addRow(item);
      // Deteksi kolom harga/total secara otomatis untuk diformat IDR
      keys.forEach((key, index) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('harga') || lowerKey.includes('total') || lowerKey.includes('price') || lowerKey.includes('amount')) {
          row.getCell(index + 1).numFmt = '"Rp "#,##0';
        }
      });
    });

    dataSheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAsExcel(buffer, `Laporan_Analisa_${platform.replace(/\s/g, '_')}.xlsx`);
};

const saveAsExcel = (buffer: ExcelJS.Buffer, fileName: string) => {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
