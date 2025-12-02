import React from 'react'

const Product = ({ p }) => {
    return (
        <div className="border rounded-xl p-4 shadow-sm bg-white w-64">
            <h3 className="text-lg text-black font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600">Category: {p.category}</p>
            <p className="text-sm text-gray-600">Price: ₹{p.price}</p>
            <p className="text-xs text-gray-500 mt-1">
                Features: {p.features.join(", ")}
            </p>
        </div>
    )
}

export default Product;
