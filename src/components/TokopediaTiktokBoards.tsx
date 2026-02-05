
const tokpedTiktokData = [
  { no: 1, info: "Biaya Komisi Platform", link: "https://seller-id.tokopedia.com/university/essay?knowledge_id=5411650459305729&default_language=id-ID&identity=1" },
  { no: 2, info: "Biaya Layanan Mall", link: "https://seller-id.tokopedia.com/university/essay?knowledge_id=7868735055857409&default_language=id-ID&identity=1" },
  { no: 3, info: "Biaya Komisi Dinamis", link: "https://seller-id.tokopedia.com/university/essay?knowledge_id=6385751723132688&default_language=id-ID&identity=1" },
  { no: 4, info: "Biaya Pemrosesan Order", link: "https://seller-id.tokopedia.com/university/essay?knowledge_id=2767365667784464&default_language=id-ID&identity=1" },
  { no: 5, info: "Program Xtra Boost [XBP]", link: "https://seller-id.tokopedia.com/university/essay?knowledge_id=260252827371281&default_language=id-ID&identity=1" },
  { no: 6, info: "Program Xtra Boost Pro - XBP Pro", link: "https://seller-id.tokopedia.com/university/essay?knowledge_id=5840400050145041&default_language=id-ID&identity=1" },
];

const TokopediaTiktokBoards = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Tokopedia & TikTok Shop</h2>
        <div className="text-sm text-slate-400">
          Dashboard / Informasi Marketplace / <span className="text-green-500">Tokopedia & TikTok Shop</span>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-dark-700 bg-dark-800/50">
          <h3 className="text-sm font-medium text-white">Tokopedia & TikTok Shop</h3>
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
              {tokpedTiktokData.map((item) => (
                <tr key={item.no} className="hover:bg-dark-700/30 transition">
                  <td className="px-6 py-4">{item.no}</td>
                  <td className="px-6 py-4">Tokopedia & TikTok</td>
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

export default TokopediaTiktokBoards;