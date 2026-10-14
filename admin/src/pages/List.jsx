import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token, setToken }) => {
  const [listProducts, setListProducts] = useState([]);

  const fetchListProducts = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setListProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Failed to load products");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.info(response.data.message);
        await fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 && setToken) {
        toast.error("Session expired, please login again");
        setToken("");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  return (
    <div className="w-full max-w-[1200px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          All Products List
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
          Total: {listProducts.length} items
        </span>
      </div>

      <div className="bg-white border-2 border-slate-300 rounded-lg overflow-hidden shadow-sm">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[80px_1.5fr_2fr_1fr_1fr_1fr_60px] items-center py-3 px-4 bg-[#edf2f7] border-b border-slate-300 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>Image</span>
          <span>Name</span>
          <span>Description</span>
          <span>Category</span>
          <span>Sub Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Display Products */}
        {listProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No products found. Add your first item from the "Add Items" page.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {listProducts.map((item, index) => (
              <div
                className="grid grid-cols-1 md:grid-cols-[80px_1.5fr_2fr_1fr_1fr_1fr_60px] items-center gap-3 p-3 md:px-4 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                key={index}
              >
                <div className="w-14 h-14 rounded-md border border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image?.[0]}
                    alt={item.name}
                  />
                </div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-slate-500 line-clamp-2 text-xs">{item.description}</p>
                <p className="font-medium text-slate-600">
                  <span className="md:hidden font-bold">Category: </span>
                  {item.category}
                </p>
                <p className="font-medium text-slate-600">
                  <span className="md:hidden font-bold">Sub Category: </span>
                  {item.subCategory}
                </p>
                <p className="font-bold text-slate-800">
                  {currency(item.price)}
                </p>
                <div className="flex md:justify-center">
                  <button
                    onClick={() => removeProduct(item._id)}
                    title="Delete product"
                    className="w-7 h-7 flex items-center justify-center font-bold text-xs text-white bg-red-500 hover:bg-red-600 active:scale-95 rounded-full transition-all cursor-pointer shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
