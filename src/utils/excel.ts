import ExcelJS from 'exceljs';

export const generateDummyExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Laporan Penjualan');

  sheet.columns = [
    { header: 'No', key: 'no' },
    { header: 'Tanggal', key: 'tanggal' },
    { header: 'Produk', key: 'produk' },
    { header: 'Kategori', key: 'kategori' },
    { header: 'Harga', key: 'harga' },
    { header: 'Qty', key: 'qty' },
    { header: 'Total', key: 'total' },
    { header: 'Platform', key: 'platform' },
  ];

  sheet.addRows([
    { no: 1, tanggal: '2023-10-01', produk: 'Kopi Susu', kategori: 'Minuman', harga: 18000, qty: 10, total: 180000, platform: 'Shopee' },
    { no: 2, tanggal: '2023-10-01', produk: 'Roti Bakar', kategori: 'Makanan', harga: 15000, qty: 5, total: 75000, platform: 'Tokopedia' },
    { no: 3, tanggal: '2023-10-02', produk: 'Kopi Hitam', kategori: 'Minuman', harga: 10000, qty: 20, total: 200000, platform: 'Gojek' },
  ]);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Dummy_Data_Penjualan.xlsx';
  anchor.click();
  window.URL.revokeObjectURL(url);
};

export const readExcelFile = async (file: File): Promise<any[]> => {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);
  
  const worksheet = workbook.getWorksheet(1);
  const data: any[] = [];
  
  // Ambil header dari baris pertama
  const headers: string[] = [];
  worksheet?.getRow(1).eachCell((cell) => {
    headers.push(cell.value as string);
  });

  // Ambil data dari baris kedua dst
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