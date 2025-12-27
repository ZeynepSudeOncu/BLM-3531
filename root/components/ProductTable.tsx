export default function ProductTable({ products }: { products: any[] }) {
    return (
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Kod</th>
              <th className="p-3 text-left">Ürün</th>
              <th className="p-3 text-right">Miktar</th>
              <th className="p-3 text-center">Durum</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.code}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-right">{p.quantity}</td>
                <td className="p-3 text-center">
                  {p.quantity === 0 ? (
                    <span className="text-red-600 font-medium">Stok Yok</span>
                  ) : p.quantity < 5 ? (
                    <span className="text-yellow-600 font-medium">Düşük</span>
                  ) : (
                    <span className="text-green-600 font-medium">Yeterli</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  