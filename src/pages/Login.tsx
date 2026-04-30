import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needEmailVerification, setNeedEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { signIn, signUp, resendVerificationEmail } = useAuth();

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    setLoading(true);
    try {
      await resendVerificationEmail(registeredEmail);
      toast.success(
        "Email verifikasi telah dikirim ulang! Cek kotak masuk atau spam.",
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Login berhasil!");
      } else {
        if (password !== confirmPassword) {
          toast.error("Konfirmasi password tidak cocok");
          setLoading(false);
          return;
        }
        const { user } = await signUp(email, password);
        if (user?.identities?.length === 0) {
          toast.error("Email sudah terdaftar. Silakan login.");
          setIsLogin(true);
        } else {
          setRegisteredEmail(email);
          setNeedEmailVerification(true);
          toast.success(
            "Pendaftaran berhasil! Silakan cek email untuk verifikasi.",
          );
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tampilan verifikasi email
  if (needEmailVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Verifikasi Email Anda
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Kami telah mengirimkan email verifikasi ke{" "}
            <strong>{registeredEmail}</strong>. Silakan cek kotak masuk Anda
            (atau folder spam) dan klik tautan verifikasi.
          </p>
          <p className="text-gray-500 text-xs mb-6">
            Setelah verifikasi, Anda dapat login ke aplikasi.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
            </button>
            <button
              onClick={() => {
                setNeedEmailVerification(false);
                setIsLogin(true);
                setEmail(registeredEmail);
              }}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🍜</div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gacoan · Table Occupancy
          </h1>
          <p className="text-gray-500 text-sm">BJMAHM System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setNeedEmailVerification(false);
            }}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Daftar" : "Login"}
          </button>
        </p>

        {/* Informasi verifikasi email untuk pengguna yang sudah daftar tapi belum verifikasi */}
        {isLogin && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-700 text-center">
            🔔 Belum menerima email verifikasi?{" "}
            <button
              onClick={async () => {
                if (!email) {
                  toast.error("Masukkan email terlebih dahulu");
                  return;
                }
                setLoading(true);
                try {
                  await resendVerificationEmail(email);
                  toast.success(
                    "Email verifikasi telah dikirim! Cek kotak masuk atau spam.",
                  );
                } catch (error: any) {
                  toast.error(error.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Kirim ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
