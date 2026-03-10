import { Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/getImageUrl';

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <p className="text-gray-400 text-center py-8">No products to show.</p>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {products.map((product) => (
        <Link key={product._id} to={`/product/${product._id}`} className='block'>
          <div className="bg-white p-4 rounded-lg hover:shadow-md transition">
            <div className="w-full h-96 mb-4">
              <img
                src={getImageUrl(product.image || product.images?.[0]?.url)}
                alt={product.name}
                className='w-full h-full object-cover rounded-lg'
              />
            </div>
            <h3 className="text-sm mb-2">{product.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">
              ₹{product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid