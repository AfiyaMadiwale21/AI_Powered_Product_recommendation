import React from "react";
import Product from "./Product";

const ProductList = ({ products }) => {
    if (!products.length) {
        return <p className="text-gray-500">No products found.</p>;
    }
    return (
        <div className="flex flex-wrap gap-4 mt-4">
            {products.map((p) => (
                <Product key={p.id} p={p} />
            ))}
        </div>
    )
}
export default ProductList;