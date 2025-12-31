'use client'
import React, { useState } from "react";
import { Bell, Package, PlusCircle, List, Megaphone, Menu, X } from "lucide-react";
import { CiDeliveryTruck } from "react-icons/ci";
import { motion } from "framer-motion";
import Orders from "./Orders";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notifications from "./Notification";
import AllProducts from "./Products";
import { AddNotice } from "./AddNotice";
import { AllMessage } from "./Messages";
import { FaImage, FaKey, FaMailBulk } from "react-icons/fa";
import ChangePassword from "./Password";
import SliderDashboard from "./Slider";
import { Rider } from "./Rider";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("orders");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#702500] text-white shadow-lg p-4 transform transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:static md:inset-0`}
            >
                <div className="flex justify-between items-center mb-6 lg:mt-0 mt-10">
                    <div className="flex items-center gap-x-3">
                        <img src="/my-logo.png" alt="লোগো" className="w-10 h-10 object-contain" />
                        <h1 className="text-2xl font-bold mt-2">ড্যাশবোর্ড</h1>
                    </div>
                    <button
                        className="md:hidden p-2 rounded hover:bg-[#f85606]"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="space-y-2">
                    <SidebarButton label="অর্ডারসমূহ" icon={<Package className="w-5 h-5" />} active={activeTab === "orders"} onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }} />
                    <SidebarButton label="নতুন পণ্য" icon={<PlusCircle className="w-5 h-5" />} active={activeTab === "add-product"} onClick={() => { setActiveTab("add-product"); setSidebarOpen(false); }} />
                    <SidebarButton label="সকল পণ্য" icon={<List className="w-5 h-5" />} active={activeTab === "products"} onClick={() => { setActiveTab("products"); setSidebarOpen(false); }} />
                    <SidebarButton label="নতুন নোটিশ" icon={<Megaphone className="w-5 h-5" />} active={activeTab === "add-notice"} onClick={() => { setActiveTab("add-notice"); setSidebarOpen(false); }} />
                    <SidebarButton label="সকল বার্তা" icon={<FaMailBulk className="w-5 h-5" />} active={activeTab === "notices"} onClick={() => { setActiveTab("notices"); setSidebarOpen(false); }} />
                    <SidebarButton label="বিজ্ঞাপণ" icon={<FaImage className="w-5 h-5" />} active={activeTab === "slider"} onClick={() => { setActiveTab("slider"); setSidebarOpen(false); }} />
                    <SidebarButton label="নতুন পাসওয়ার্ড" icon={<FaKey className="w-5 h-5" />} active={activeTab === "password"} onClick={() => { setActiveTab("password"); setSidebarOpen(false); }} />
                    <SidebarButton label="রাইডার" icon={<CiDeliveryTruck className="w-8 h-8" />} active={activeTab === "rider"} onClick={() => { setActiveTab("rider"); setSidebarOpen(false); }} />
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-y-auto">
                <div className="flex justify-between items-center relative">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 rounded hover:bg-gray-200"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>

                    <div className="fixed sm:right-6 right-2 sm:top-24 z-50 top-[60px] rounded-full shadow">
                        <Notifications active={activeTab} />
                    </div>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white sm:p-4 p-0 rounded-2xl shadow-md"
                >
                    {activeTab === "orders" && <Orders />}
                    {activeTab === "add-product" && <AddProduct />}
                    {activeTab === "products" && <AllProducts />}
                    {activeTab === "add-notice" && <AddNotice />}
                    {activeTab === "slider" && <SliderDashboard />}
                    {activeTab === "notices" && <AllMessage />}
                    {activeTab === "password" && <ChangePassword />}
                    {activeTab === "rider" && <Rider />}
                </motion.div>
            </main>

            <ToastContainer />
        </div>
    );
}

function SidebarButton({ label, icon, active, onClick }) {
    return (
        <button
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition text-left ${active
                ? "bg-white text-[#f85606] font-bold"
                : "hover:bg-[#f85606] text-white"
                }`}
            onClick={onClick}
        >
            {icon} {label}
        </button>
    );
}

export function AddProduct() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        deliveryCharge: "", // ডেলিভারি চার্জ যোগ
        details: "",
        images: [],
        category: "",
    });

    const categories = [
        { label: " অর্গানিক ফুড", value: "organic_food" },
        { label: " কনস্ট্রাকশন ", value: "construction" },
        { label: " ইলেকট্রিক ", value: "electric" },
        { label: " হার্ডওয়্যার ", value: "hardware" },
        { label: " স্যানিটারি ", value: "sanitary" },
        { label: " ঢেউটিন ও এলবেস্টার ", value: "roofing_albestar" },
        { label: " গ্যাস সিলিন্ডার ", value: "gas_cylinder" },
        { label: " কুকারিজ ও কিচেন আইটেমস ", value: "cookeries_kitchen" },
    ];


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = [];

        files.forEach((file) => {
            const maxSize = 3 * 1024 * 1024; // 3MB
            if (file.size > maxSize) {
                toast.error(`⚠️ ${file.name} এর সাইজ 3MB এর বেশি!`);
            } else {
                validImages.push(file);
            }
        });

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...validImages],
        }));

        e.target.value = "";
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category || !formData.deliveryCharge) {
            toast.error("⚠️ সব তথ্য পূরণ করুন!");
            return;
        }

        if (formData.images.length === 0) {
            toast.error("⚠️ অন্তত একটি ছবি যোগ করুন!");
            return;
        }

        if (formData.images.length > 5) {
            toast.error("⚠️ সর্বোচ্চ ৫টি ছবি অনুমোদিত!");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "images") {
                    value.forEach((img) => data.append("images", img));
                } else {
                    data.append(key, value);
                }
            });

            const res = await fetch("/api/products", { method: "POST", body: data });
            const result = await res.json();

            if (result.success) {
                toast.success(result.message || "✅ সফলভাবে যোগ করা হয়েছে!");
                setFormData({
                    name: "",
                    price: "",
                    deliveryCharge: "",
                    details: "",
                    images: [],
                    category: "",
                });
            } else {
                toast.error(result.message || "❌ কিছু সমস্যা হয়েছে!");
            }
        } catch (error) {
            console.log(error);
            toast.error("❌ সার্ভার এরর!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:p-0 p-2">
            <h3 className="text-lg font-semibold mb-3 text-[#f85606]">নতুন পণ্য যোগ করুন</h3>

            <input type="text" name="name" placeholder="পণ্যের নাম" value={formData.name} onChange={handleChange} className="w-full border border-[#f85606] outline-[#f85606] text-[#f85606] p-2 rounded-lg" />
            <input type="number" name="price" placeholder="দাম (৳)" value={formData.price} onChange={handleChange} className="w-full border border-[#f85606] outline-[#f85606] text-[#f85606] p-2 rounded-lg" />
            <input type="number" name="deliveryCharge" placeholder="ডেলিভারি চার্জ (৳)" value={formData.deliveryCharge} onChange={handleChange} className="w-full border border-[#f85606] outline-[#f85606] text-[#f85606] p-2 rounded-lg" />
            <textarea name="details" placeholder="বিবরণ" value={formData.details} onChange={handleChange} className="w-full border border-[#f85606] outline-[#f85606] text-[#f85606] p-2 rounded-lg"></textarea>

            <select
                name="category"
                onChange={handleChange}
                value={formData.category}
                className="w-full border border-[#f85606] outline-[#f85606] text-[#f85606] p-2 rounded-lg"
                required
            >
                <option value="">-- ক্যাটাগরি নির্বাচন করুন --</option>
                {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                ))}
            </select>

            <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" multiple onChange={handleImageChange} className="w-full border border-[#f85606] outline-[#f85606] text-[#f85606] p-2 rounded-lg" />

            {/* Image Preview */}
            {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
                    {formData.images.map((img, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${index}`}
                                className="w-full rounded-lg border"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 text-xs hover:bg-red-600"
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button type="submit" className="bg-[#f85606] hover:bg-[#702500] text-white px-4 py-2 rounded-lg">
                {loading ? "লোড হচ্ছে..." : "যোগ করুন"}
            </button>
        </form>
    );
}
