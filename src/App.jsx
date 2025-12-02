import React from "react";
import { useState } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";
import { OPENROUTER_API_KEY } from "./config";

export default function App() {
  const [preference, setPreference] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product list
  const products = [
    { id: 1, name: "iPhone 14", price: "57,190", category: "Phone", features: ["A15", "128GB", "Dual Camera"] },
    { id: 2, name: "Samsung Galaxy S21", price: "65,999", category: "Phone", features: ["AMOLED", "5G", "128GB"] },
    { id: 3, name: "Redmi Note 12", price: "15,600", category: "Phone", features: ["108MP Camera", "5000mAh"] },
    { id: 4, name: "OnePlus Nord CE", price: "22,999", category: "Phone", features: ["OxygenOS", "65W Charging"] },
    { id: 5, name: "Realme 14 pro 5G", price: "24,999", category: "Phone", features: ["5000mAh", "128GB"] },
  ];

  const productListString = products
    .map((p) => `${p.name} - ₹${p.price}`)
    .join("\n");

  const handleAskAI = async () => {
    if (!preference.trim()) return;

    setLoading(true);
    setRecommendedProducts([]);

    const prompt = `
You are a product recommendation AI.
Here are the available products:
${productListString}

User preference: "${preference}"

From the list, recommend 2–3 product NAMES only.
        `;

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiText = response.data.choices[0].message.content;

      // Extract product names
      const recommendedNames = aiText
        .split("\n")
        .map((line) => line.replace("-", "").trim())
        .filter(Boolean);

      const filtered = products.filter((p) =>
        recommendedNames.some((name) =>
          p.name.toLowerCase().includes(name.toLowerCase())
        )
      );

      setRecommendedProducts(filtered);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-white p-6">
      <h1 className="text-3xl text-black font-extrabold text-center mb-6"> AI Product Recommendation System </h1>
      <div className="max-w-2xl mx-auto text-black bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40">
        <label className="block mb-2 text-lg">Enter your preference:</label>
        <input value={preference} onChange={(e) => setPreference(e.target.value)}
          placeholder='type here' className="w-full p-3 rounded-lg bg-white focus:outline-none border-1 border-black" />
        <button onClick={handleAskAI} disabled={loading} className="mt-4 w-full bg-black hover:bg-gray-700 text-white p-3 rounded-lg text-lg font-semibold disabled:bg-gray-600" >
          {loading ? "Getting Recommendation..." : "Ask AI"} </button>
        <h2 className="text-xl font-semibold mt-6">All Products</h2>
        <ProductList products={products} />
        {recommendedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">🎯AI-Selected Products Based on Your Preferences</h2>
            <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-5 rounded-2xl shadow-lg border border-white/40">
              <ProductList products={recommendedProducts} />
            </div>

          </div>
        )
        }
      </div>
    </div>
  );
}