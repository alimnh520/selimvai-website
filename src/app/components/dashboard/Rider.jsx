'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaDeleteLeft } from "react-icons/fa6";

export function Rider() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [riders, setRiders] = useState([]);
    const [showListPass, setShowListPass] = useState({});
    const [preview, setPreview] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);


    /* 🔄 Fetch Riders */
    const fetchRiders = async () => {
        const res = await fetch("/api/rider");
        const data = await res.json();
        if (data.success) setRiders(data.riders);
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("username", form.username);
            formData.append("email", form.email);
            formData.append("password", form.password);
            if (form.image) {
                formData.append("image", form.image);
            }

            const res = await fetch("/api/rider", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("🎉 Rider যুক্ত হয়েছে!");
                setForm({ username: "", email: "", password: "", image: null });
                setPreview(null);
                fetchRiders();
            } else {
                const err = await res.json();
                toast.error(err.message || "❌ ব্যর্থ!");
            }

        } catch (err) {
            toast.error("⚠️ সার্ভার এরর!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/rider`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deleteId, imageId })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("🗑️ Rider ডিলিট হয়েছে");
                fetchRiders();
            } else {
                toast.error(data.message || "ডিলিট ব্যর্থ");
            }
        } catch {
            toast.error("সার্ভার এরর");
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
        }
    };



    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-6xl mx-auto space-y-10">

                {showConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white border-2 border-[#f85606] rounded-2xl p-6 w-[320px] shadow-xl">
                            <h3 className="text-xl font-bold text-[#f85606] mb-2">
                                Rider Delete করবেন?
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                একবার ডিলিট করলে আর ফেরত আনা যাবে না।
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-[#f85606] text-white rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* ➕ Add Rider */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border-2 border-[#f85606] rounded-2xl p-6 shadow-lg space-y-4"
                >
                    <h2 className="text-2xl font-bold text-[#f85606]">
                        ➕ Add Rider
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            placeholder="Name"
                            className="w-full border-2 border-[#f85606] rounded-lg px-4 py-2 outline-none"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            required
                        />

                        <input
                            placeholder="Email"
                            type="email"
                            className="w-full border-2 border-[#f85606] rounded-lg px-4 py-2 outline-none"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            placeholder="Password"
                            type={showPass ? "text" : "password"}
                            className="w-full border-2 border-[#f85606] rounded-lg px-4 py-2 pr-10 outline-none"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <span
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-3 cursor-pointer text-[#f85606]"
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Image Upload + Preview */}
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-[#f85606] font-medium">
                            <FaImage />
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    setForm({ ...form, image: file });
                                    setPreview(URL.createObjectURL(file));
                                }}
                            />
                        </label>

                        {preview && (
                            <img
                                src={preview}
                                className="w-16 h-16 rounded-full border-2 border-[#f85606] object-cover"
                            />
                        )}
                    </div>

                    <button
                        disabled={loading}
                        className="bg-[#f85606] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
                    >
                        {loading ? "Saving..." : "Add Rider"}
                    </button>
                </form>

                {/* 📋 Rider List */}
                <div className="bg-white border-2 border-[#f85606] rounded-2xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-[#f85606] mb-6">
                        📋 Rider List
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {riders.map(r => (
                            <div
                                key={r._id}
                                className="flex items-center relative overflow-hidden gap-4 border-2 border-[#f85606] rounded-xl p-4 hover:shadow-md transition"
                            >
                                <img
                                    src={r.image}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#f85606]"
                                />

                                <div className="flex-1">
                                    <p className="font-semibold">{r.username}</p>
                                    <p className="text-sm text-gray-600">{r.email}</p>

                                    <div className="flex items-center gap-2 text-sm mt-1">
                                        <span>
                                            {showListPass[r._id] ? r.password : "••••••••"}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setShowListPass(p => ({
                                                    ...p,
                                                    [r._id]: !p[r._id],
                                                }))
                                            }
                                            className="text-[#f85606]"
                                        >
                                            {showListPass[r._id] ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <Link href="https://ecommerce-tracking-production.up.railway.app/" className="relative right-5">
                                    <FaEnvelope className="text-3xl text-[#f85606] cursor-pointer" />
                                </Link>

                                <button
                                    onClick={() => {
                                        setDeleteId(r._id);
                                        setImageId(r.imageId);
                                        setShowConfirm(true);
                                    }}
                                    className="text-red-600 absolute -top-1.5 right-0 text-3xl cursor-pointer hover:scale-110 transition"
                                >
                                    <FaDeleteLeft />
                                </button>


                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
