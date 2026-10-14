import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("Please upload at least one image");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
  };

  const renderUploadBox = (id, image, setImage) => (
    <label
      htmlFor={id}
      className="w-20 h-20 border-2 border-slate-500 rounded-lg cursor-pointer bg-white hover:bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all group shrink-0"
    >
      {image ? (
        <div className="relative w-full h-full group">
          <img
            className="w-full h-full object-cover"
            src={URL.createObjectURL(image)}
            alt="Preview"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-medium transition-all">
            Change
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          <span className="text-[11px] font-medium mt-0.5 text-slate-500">Upload</span>
        </div>
      )}
      <input
        onChange={(e) => e.target.files[0] && setImage(e.target.files[0])}
        type="file"
        id={id}
        hidden
        accept="image/*"
      />
    </label>
  );

  return (
    <div className="w-full max-w-[800px]">
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 text-slate-800">
        {/* Upload Product Image(s) */}
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-2">
            Upload Product Image(s)
          </h2>
          <div className="flex items-center gap-3">
            {renderUploadBox("image1", image1, setImage1)}
            {renderUploadBox("image2", image2, setImage2)}
            {renderUploadBox("image3", image3, setImage3)}
            {renderUploadBox("image4", image4, setImage4)}
          </div>
        </div>

        {/* Product Item Name */}
        <div className="w-full max-w-[560px]">
          <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
            Product Item Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3.5 py-2.5 border-2 border-slate-500 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:border-slate-800"
            type="text"
            placeholder="Enter Product Name"
            required
          />
        </div>

        {/* Product Item Description */}
        <div className="w-full max-w-[560px]">
          <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
            Product Item Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-3.5 py-2.5 border-2 border-slate-500 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:border-slate-800 h-24 resize-y"
            placeholder="Enter Product Description"
            required
          />
        </div>

        {/* Three Columns: Category, Sub Category, Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-[560px]">
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
              Product Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-3 py-2.5 border-2 border-slate-500 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:border-slate-800"
              required
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
              Product Sub Category
            </label>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full px-3 py-2.5 border-2 border-slate-500 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:border-slate-800"
              required
            >
              <option value="">Select Sub Category</option>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
              Product Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2.5 border-2 border-slate-500 rounded-lg text-sm bg-white placeholder-slate-400 focus:outline-none focus:border-slate-800"
              type="number"
              placeholder="Enter Product Price"
              required
              min="0"
            />
          </div>
        </div>

        {/* Product Sizes */}
        <div>
          <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
            Product Sizes
          </label>
          <div className="flex items-center gap-2.5">
            {["S", "M", "L", "XL", "XXL"].map((size) => {
              const isSelected = sizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((item) => item !== size)
                        : [...prev, size]
                    )
                  }
                  className={`min-w-9 h-7 px-2 flex items-center justify-center text-xs font-semibold rounded transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1e293b] text-white shadow-sm"
                      : "bg-[#e2e8f0] text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Seller Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="bestSeller"
            checked={bestSeller}
            onChange={() => setBestSeller((prev) => !prev)}
            className="w-4 h-4 rounded border-slate-400 accent-slate-800 cursor-pointer"
          />
          <label
            htmlFor="bestSeller"
            className="text-xs sm:text-sm font-medium text-slate-800 cursor-pointer select-none"
          >
            Add to Best Seller
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#233142] hover:bg-[#16202c] active:scale-95 text-white font-semibold text-xs sm:text-sm rounded transition-all duration-150 shadow-sm disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 bg-[#233142] hover:bg-[#16202c] active:scale-95 text-white font-semibold text-xs sm:text-sm rounded transition-all duration-150 shadow-sm"
          >
            Reset Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
