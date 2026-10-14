import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token, setToken }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      if (error.response?.status === 401 && setToken) {
        toast.error("Session expired, please login again");
        setToken("");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }
  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };
  
  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className="w-full max-w-[1200px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          Customer Orders
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
          Total: {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border-2 border-slate-300 rounded-lg p-12 text-center text-slate-400 text-sm">
          No orders placed yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border-2 border-slate-300 rounded-lg p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-[60px_2fr_1.2fr_1fr_1.2fr] gap-4 items-start text-xs sm:text-sm text-slate-700 hover:border-slate-400 transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-[#edf2f7] flex items-center justify-center p-2.5 border border-slate-200">
                <img className="w-full h-full object-contain" src={assets.parcel_icon} alt="Order" />
              </div>

              <div>
                <div className="space-y-1">
                  {order.items.map((item, itemIndex) => (
                    <p className="font-semibold text-slate-800" key={itemIndex}>
                      {item.name} <span className="text-slate-500 font-normal">x {item.quantity}</span>{' '}
                      <span className="ml-1 px-1.5 py-0.5 text-[11px] bg-slate-100 border border-slate-200 rounded font-medium">{item.size}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 font-bold text-slate-900">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  <p>{order.address?.street}</p>
                  <p>
                    {order.address?.city}, {order.address?.state}, {order.address?.country} - {order.address?.zipcode}
                  </p>
                  <p className="font-medium text-slate-700 mt-1">📞 {order.address?.phone}</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200">
                <p><span className="font-semibold text-slate-700">Total Items:</span> {order.items?.length}</p>
                <p><span className="font-semibold text-slate-700">Method:</span> <span className="uppercase font-medium text-slate-800">{order.paymentMethod}</span></p>
                <p>
                  <span className="font-semibold text-slate-700">Payment:</span>{' '}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.payment ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {order.payment ? 'PAID' : 'PENDING'}
                  </span>
                </p>
                <p><span className="font-semibold text-slate-700">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold text-slate-500">Amount</span>
                <span className="text-lg font-bold text-slate-900">
                  ₹{order.amount}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-600">Order Status:</span>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="px-3 py-2 text-xs font-semibold text-slate-800 bg-white border-2 border-slate-400 rounded-lg focus:outline-none focus:border-slate-800 cursor-pointer"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
