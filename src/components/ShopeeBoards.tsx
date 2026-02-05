
const shopeeData = [
  { no: 1, info: "Biaya Administrasi Penjual Shopee", link: "https://seller.shopee.co.id/edu/article/7187" },
  { no: 2, info: "Rincian Biaya Penjual Shopee per Kategori Produk", link: "https://seller.shopee.co.id/edu/article/15965" },
  { no: 3, info: "Biaya Layanan pada Program Promo XTRA & Gratis Ongkir XTRA", link: "https://seller.shopee.co.id/edu/article/7216" },
  { no: 4, info: "Informasi Biaya Proses Pesanan", link: "https://seller.shopee.co.id/edu/article/25787" },
  { no: 5, info: "Biaya Layanan pada Program Shopee Live XTRA", link: "https://seller.shopee.co.id/edu/article/19969" },
  { no: 6, info: "Biaya Pembayaran Penjual Shopee Mall", link: "https://seller.shopee.co.id/edu/article/6756" },
  { no: 7, info: "Ringkasan Jenis Biaya untuk Berjualan di Shopee", link: "https://seller.shopee.co.id/edu/article/3489" },
  { no: 8, info: "Program SPayLater XTRA 0%", link: "https://seller.shopee.co.id/edu/article/25354" },
];

const ShopeeBoards = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Shopee</h2>
        <div className="text-sm text-slate-400">
          Dashboard / Informasi Marketplace / <span className="text-orange-500">Shopee</span>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-dark-700 bg-dark-800/50">
          <h3 className="text-sm font-medium text-white">Shopee</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-dark-900/50 border-b border-dark-700">
              <tr>
                <th className="px-6 py-4 font-semibold">No</th>
                <th className="px-6 py-4 font-semibold">Marketplace</th>
                <th className="px-6 py-4 font-semibold">Informasi Detail Biaya</th>
                <th className="px-6 py-4 font-semibold">Tautan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {shopeeData.map((item) => (
                <tr key={item.no} className="hover:bg-dark-700/30 transition">
                  <td className="px-6 py-4">{item.no}</td>
                  <td className="px-6 py-4">Shopee</td>
                  <td className="px-6 py-4 text-slate-300">{item.info}</td>
                  <td className="px-6 py-4">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline break-all">
                      {item.link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopeeBoards;
