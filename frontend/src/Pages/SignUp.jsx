import React, { useState, useEffect } from "react";
import { Eye, EyeOff, AtSign, User, Mail, Lock } from "lucide-react";
import { useApp } from "../ContextProvider/AppContext";
import profilePic from "../assets/profile-pic.jpg";
import communityImg from "../assets/signup-image.png";
import toast from "react-hot-toast";

const SignUp = () => {
  const { setPage, register, loading, error, setError } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(profilePic);

  useEffect(() => {
    return () => {
      if (typeof previewSrc === "string" && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError?.("");
    try {
      await register({ name, username, email, password, profilePicture: profilePictureFile });
      toast.success("Register Successfull !")
      setPage("Login");
    } catch (err) {
       const message=err?.response?.data?.message || err?.message|| "SignUp failed";
      setError(message );
      toast.error(message);
    }
  };

  return (
    <div className="flex-1 flex w-full h-full overflow-hidden">

      {/* ── Left: Form ── */}
      <div className="w-[580px] shrink-0 flex flex-col justify-center px-16 py-10 bg-white overflow-y-auto ">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Join the Conversation</h1>
        <p className="text-sm text-gray-500 mb-6">
          Create an account to cast your vote, start polls, and engage with your community on matters that count.
        </p>

        {/* Avatar upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-20 h-20">
            <img
              src={previewSrc}
              alt="Profile preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <label
              htmlFor="profile-input"
              className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
            />
            <input
              id="profile-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setProfilePictureFile(file);
                setPreviewSrc(URL.createObjectURL(file));
              }}
            />
          </div>
          <label htmlFor="profile-input" className="mt-2 text-sm text-blue-700 font-medium cursor-pointer hover:underline">
            Upload Photo
          </label>
        </div>

        <div className="flex flex-col gap-4">

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500">
              <AtSign size={15} className="text-gray-400" />
              <input
                type="text" placeholder="johndoe123" value={username} required
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 py-2.5 text-sm outline-none bg-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={15} className="text-gray-400" />
              <input
                type="text" placeholder="John Doe" value={name} required
                onChange={(e) => setName(e.target.value)}
                className="flex-1 py-2.5 text-sm outline-none bg-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail size={15} className="text-gray-400" />
              <input
                type="email" placeholder="john@example.com" value={email} required
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-2.5 text-sm outline-none bg-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock size={15} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} required
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 py-2.5 text-sm outline-none bg-transparent placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox" checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-blue-700"
            />
            I agree to the{" "}
            <a href="#" className="text-blue-700 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>.
          </label>


          {/* Submit */}
          <button
            type="button" onClick={handleRegister}
            disabled={loading || !agreed}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/452235/apple.svg" className="w-4 h-4" alt="SSO" />
              SSO
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button type="button" onClick={() => setPage("Login")} className="text-blue-700 font-medium hover:underline">
              Log In
            </button>
          </p>

        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-gray-100 px-7">
        <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Modern Tools for Modern Democracy
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We provide the infrastructure required to bridge the gap between community needs and government actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Feature 1: Analytics - wide */}
          <div className="md:col-span-8 bg-white border border-gray-200 p-8 rounded-xl flex flex-col md:flex-row gap-8 overflow-hidden shadow-sm">
            <div className="md:w-1/2 space-y-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-blue-700 text-xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Real-time Analytics</h3>
              <p className="text-gray-500 text-sm">
                Visualize public sentiment as it happens. Our dashboard translates complex demographic data into actionable insights for policymakers.
              </p>
              <ul className="space-y-2 pt-2">
                {["Dynamic trend tracking", "Demographic heatmaps"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-blue-700">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bar chart mock */}
            <div className="md:w-1/2 bg-gray-50 p-3 rounded-lg">
              <div className="h-full min-h-[200px] rounded border border-gray-100 bg-white p-3 relative overflow-hidden">
                <div className="flex items-end justify-between h-32 gap-1">
                  {[30, 50, 40, 70, 90, 80].map((h, i) => (
                    <div
                      key={i}
                      className="w-full rounded-t-sm bg-blue-700"
                      style={{ height: `${h}%`, opacity: 0.2 + i * 0.15 }}
                    />
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-2/3 bg-gray-100 rounded" />
                </div>
                {/* Live indicator */}
                <div className="absolute top-4 right-4">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-700 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-700" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Security - dark */}
          <div className="md:col-span-4 bg-blue-900 p-8 rounded-xl space-y-3 shadow-md">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-white">Secure Voting</h3>
            <p className="text-white/70 text-sm">
              End-to-end encryption ensures every vote is anonymous, tamper-proof, and fully verifiable by the individual voter.
            </p>
            <div className="pt-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
                <span className="text-white/40">🔑</span>
                <span className="text-xs font-mono text-white/50 truncate">
                  0x71C7656EC7ab88b098defB...
                </span>
              </div>
            </div>
          </div>

          {/* Feature 3: Community Insights */}
          <div className="md:col-span-4 bg-white border border-gray-200 p-8 rounded-xl space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-purple-700 text-xl">👥</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Community Insights</h3>
            <p className="text-gray-500 text-sm">
              Deep-dive into local discourse with sentiment analysis and topic clustering to identify what matters most.
            </p>
          </div>

          {/* Feature 4: Hyper-Local */}
          <div className="md:col-span-8 bg-white border border-gray-200 p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center shadow-sm">
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-bold text-gray-900">Hyper-Community Focus</h3>
              <p className="text-gray-500 text-sm">
                Engagement tailored to not to miss any community, ensuring thatissues get the attention they deserve from the people they affect.
              </p>
              
            </div>
            <div className="md:w-1/2 w-full h-40 rounded-lg bg-slate-100 overflow-hidden relative">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBB7s6rC6Gt7rPfR4e-cYqidTuVTzsggXu7rQieJOb547kMgBckphBylj-pJCROKDlw_QUx_zj-6uzmt5NYB98Z3L57i8CyFgnr11n6RtvcH0q6GVj_HCVyEsRispPH-i5NMyuMuy5S8gdagzXYdXP8IpQgJ_ki7MdIhk3EqxU3EAvpE0p4E93akwrxTTNEbD-7QtbIrH4Ntka_Rs5uIcSDVZVIOZXmeikVywhQ0LLMDJTLpn5Zn1z2i_L8q0r3khIthSvIJDpLSK7A')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-700 rounded-full ring-4 ring-blue-700/20 animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </section>
      </div>

      

    </div>
  );
};

export default SignUp;