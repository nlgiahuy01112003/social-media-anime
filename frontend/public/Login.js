import { useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Đăng nhập thành công! 🌟");
      navigate("/feed");
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập thất bại! 😿");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-anime-gradient">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative p-8 bg-white rounded-2xl shadow-anime-glow w-full max-w-md"
      >
        <motion.img
          src="/sparkle.png"
          className="absolute top-0 left-0 w-12 h-12 animate-sparkle"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <h2 className="text-3xl font-anime text-anime-purple mb-6 text-center">
          Đăng Nhập Kawaii ✨
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn 💌"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg focus:outline-none focus:border-anime-blue font-anime"
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu bí mật 🔒"
            className="w-full p-3 mb-4 border-2 border-anime-pink rounded-lg focus:outline-none focus:border-anime-blue font-anime"
            disabled={loading}
          />
          <motion.button
            whileHover={{
              scale: loading ? 1 : 1.05,
              boxShadow: loading ? "none" : "0 0 15px rgba(84, 160, 255, 0.8)",
            }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            className={`w-full p-3 bg-anime-blue text-white rounded-lg font-anime ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Vào Thế Giới Anime! 🌟"}
          </motion.button>
        </form>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(255, 105, 180, 0.8)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="w-full mt-4 p-3 bg-anime-pink text-white rounded-lg font-anime"
            >
              Đăng Ký Ngay! 💖
            </motion.button>
      </motion.div>
    </div>
  );
}

export default Login;
