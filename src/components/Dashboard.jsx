import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit2,
  Check,
  X,
  PieChart as PieIcon,
  Activity,
  Sparkles,
  Plus,
  Search,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- MOCK DATA ---
const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    date: "2024-03-01",
    category: "Salary",
    amount: 50000,
    type: "income",
  },
  {
    id: 2,
    date: "2024-03-02",
    category: "Rent",
    amount: 15000,
    type: "expense",
  },
  {
    id: 3,
    date: "2024-03-05",
    category: "Groceries",
    amount: 5000,
    type: "expense",
  },
  {
    id: 4,
    date: "2024-03-10",
    category: "Freelance",
    amount: 12000,
    type: "income",
  },
];

const CHART_DATA = [
  { name: "W1", balance: 35000 },
  { name: "W2", balance: 42000 },
  { name: "W3", balance: 38000 },
  { name: "W4", balance: 47000 },
];

const Dashboard = () => {
  // --- State Management ---
  const [showDashboard, setShowDashboard] = useState(false);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [role, setRole] = useState("admin");
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category: "",
    amount: 0,
    type: "expense",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // --- Utilities ---
  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);

  // --- Logic: Filtering, Totals, & Insights ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, typeFilter]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        const amt = Number(curr.amount);
        curr.type === "income" ? (acc.income += amt) : (acc.expense += amt);
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const cats = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
    const highest =
      Object.keys(cats).length > 0
        ? Object.keys(cats).reduce((a, b) => (cats[a] > cats[b] ? a : b))
        : "N/A";
    const savings = totals.income - totals.expense;
    const rate =
      totals.income > 0 ? ((savings / totals.income) * 100).toFixed(0) : 0;
    return { highestCat: highest, savingsRate: rate + "%" };
  }, [transactions, totals]);

  const pieData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const cats = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
    return Object.keys(cats).map((name) => ({ name, value: cats[name] }));
  }, [transactions]);

  const COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6"];

  // --- Actions ---
  const handleAddTransaction = () => {
    const newTx = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      category: "New Entry",
      amount: 0,
      type: "income",
    };
    setTransactions([newTx, ...transactions]);
    setEditId(newTx.id);
    setEditFormData({
      category: newTx.category,
      amount: newTx.amount,
      type: newTx.type,
    });
  };

  const handleSave = (id) => {
    setTransactions(
      transactions.map((item) =>
        item.id === id ? { ...item, ...editFormData } : item,
      ),
    );
    setEditId(null);
  };

  return (

    <div className="bg-[#0b0f1a] min-h-screen p-4 md:p-12 flex flex-col items-center justify-start font-sans overflow-x-hidden">
      {/* 1. INITIAL LANDING VIEW */}
      <AnimatePresence>
        {!showDashboard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center mt-24 z-50 text-center"
          >
            <h5 className="text-white text-3xl font-black mb-2 tracking-tight">
              Hello 👋
            </h5>
            <img
              src="/girl-pusher.png"
              alt="Character"
              className="w-64 h-auto drop-shadow-2xl mb-8"
            />
            <h2 className="text-white text-3xl font-black mb-2 tracking-tight">
              FinVue Dashboard
            </h2>
            <p className="text-slate-400 mb-8">
              Ready to analyze your spending
            </p>
            <button
              onClick={() => setShowDashboard(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-indigo-500/20"
            >
              CLICK TO VIEW YOUR DETAILS <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. UNROLLING DASHBOARD VIEW */}
      {showDashboard && (
        <div className="relative w-full max-w-6xl mt-32 ml-10 lg:ml-32">
          {/* Character Pushing Position with Speech Bubble */}
          <motion.div
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: -130, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -left-20 -top-32 z-[100] pointer-events-none hidden lg:block"
          >
            {/* The Speech Bubble - Moved tosit below the padding cut-off */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="absolute top-10 left-56 bg-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-indigo-100 min-w-[220px] flex items-center justify-center"
            >
              <h6 className="text-indigo-600 text-lg font-black tracking-tight whitespace-nowrap m-0">
                Here is your data! ✨
              </h6>

              {/* Speech Bubble Tail - Pointing left towards the girl */}
              <div className="absolute -left-3 top-4 w-0 h-0 
                border-t-[10px] border-t-transparent 
                border-b-[10px] border-b-transparent 
                border-r-[12px] border-r-white"
              ></div>
            </motion.div>

            {/* The Woman Image */}
            <img
              src="/girl-pusher.png"
              alt="Character"
              className="w-80 h-auto scale-x-[-1] drop-shadow-2xl"
            />
          </motion.div>
          {/* Silver Scroll Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 left-[-5%] w-[110%] h-10 bg-gradient-to-b from-slate-400 via-slate-100 to-slate-400 rounded-full shadow-2xl z-30"
          />

          {/* Unrolling Content - CHANGED overflow-hidden TO overflow-visible */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-[#fdfdfb] w-full rounded-b-[2rem] shadow-2xl overflow-visible origin-top border-x-[16px] border-slate-100/50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="p-6 md:p-10 pt-16"
            >
              {/* Header & Role Switcher */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    FinVue <span className="text-indigo-600">Pro</span>
                  </h1>
                  <p className="text-slate-400 font-medium text-sm italic">
                    Financial Overview Dashboard
                  </p>
                </div>
                <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
                  <button
                    onClick={() => {
                      setRole("viewer");
                      setEditId(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${role === "viewer" ? "bg-white shadow-md text-indigo-600" : "text-slate-400"}`}
                  >
                    VIEWER
                  </button>
                  <button
                    onClick={() => setRole("admin")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${role === "admin" ? "bg-white shadow-md text-indigo-600" : "text-slate-400"}`}
                  >
                    ADMIN
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                  title="Total Balance"
                  amount={totals.income - totals.expense}
                  icon={<IndianRupee />}
                  theme="indigo"
                  format={formatINR}
                />
                <StatCard
                  title="Monthly Income"
                  amount={totals.income}
                  icon={<TrendingUp />}
                  theme="emerald"
                  format={formatINR}
                />
                <StatCard
                  title="Monthly Spends"
                  amount={totals.expense}
                  icon={<TrendingDown />}
                  theme="rose"
                  format={formatINR}
                />
              </div>

              {/* Insights Bar */}
              <div className="bg-indigo-50/50 rounded-3xl p-6 mb-10 border border-indigo-100 flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <h2 className="font-bold text-indigo-900 uppercase text-[10px] tracking-widest">
                    Insights
                  </h2>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    Top Category:
                  </span>{" "}
                  <span className="font-black text-slate-800 ml-2">
                    {insights.highestCat}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    Savings Rate:
                  </span>{" "}
                  <span className="font-black text-emerald-600 ml-2">
                    {insights.savingsRate}
                  </span>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <ChartWrapper title="Balance Trend" icon={<Activity />}>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={CHART_DATA}>
                      <XAxis dataKey="name" hide />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#6366f1"
                        fillOpacity={0.1}
                        fill="#6366f1"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartWrapper>
                <ChartWrapper title="Spending Breakdown" icon={<PieIcon />}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                            cornerRadius={10}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>

              {/* Transactions Table Section */}
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
                  <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">
                    Transactions
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="flex bg-slate-200/50 p-1 rounded-full border border-slate-200">
                      {["all", "income", "expense"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTypeFilter(type)}
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${typeFilter === type ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="relative flex-grow min-w-[200px]">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type="text"
                        placeholder="Search category..."
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {role === "admin" && (
                      <button
                        onClick={handleAddTransaction}
                        className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg whitespace-nowrap"
                      >
                        <Plus size={16} /> ADD ENTRY
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest px-6">
                        <th className="px-6">Date</th>
                        <th className="px-6">Category</th>
                        <th className="px-6">Type</th>
                        <th className="px-6 text-right">Amount</th>
                        {role === "admin" && (
                          <th className="px-6 text-center">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {filteredTransactions.map((t) => (
                          <motion.tr
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={t.id}
                            className="bg-white group hover:shadow-md transition-all"
                          >
                            <td className="px-6 py-4 text-[10px] font-bold text-slate-400 first:rounded-l-2xl">
                              {t.date}
                            </td>
                            <td className="px-6 py-4">
                              {editId === t.id ? (
                                <input
                                  className="bg-slate-50 border border-indigo-200 rounded-lg px-2 py-1 text-sm outline-none w-full"
                                  value={editFormData.category}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      category: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <span className="font-bold text-slate-800">
                                  {t.category}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editId === t.id ? (
                                <select
                                  className="bg-slate-50 border border-indigo-200 rounded-lg px-2 py-1 text-[10px] font-bold"
                                  value={editFormData.type}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      type: e.target.value,
                                    })
                                  }
                                >
                                  <option value="income">INCOME</option>
                                  <option value="expense">EXPENSE</option>
                                </select>
                              ) : (
                                <span
                                  className={`text-[9px] px-2 py-1 rounded-full font-black uppercase ${t.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"}`}
                                >
                                  {t.type}
                                </span>
                              )}
                            </td>
                            <td
                              className={`px-6 py-4 text-right font-black ${t.type === "income" ? "text-emerald-500" : "text-slate-900"} ${role !== "admin" && "last:rounded-r-2xl"}`}
                            >
                              {editId === t.id ? (
                                <input
                                  type="number"
                                  className="bg-slate-50 border border-indigo-200 rounded-lg px-2 py-1 text-sm outline-none w-24 text-right"
                                  value={editFormData.amount}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      amount: Number(e.target.value),
                                    })
                                  }
                                />
                              ) : (
                                `${t.type === "income" ? "+" : "-"} ${formatINR(t.amount)}`
                              )}
                            </td>
                            {role === "admin" && (
                              <td className="px-6 py-4 text-center last:rounded-r-2xl">
                                <div className="flex justify-center gap-3">
                                  {editId === t.id ? (
                                    <button
                                      onClick={() => handleSave(t.id)}
                                      className="text-emerald-500"
                                    >
                                      <Check size={18} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setEditId(t.id);
                                        setEditFormData({
                                          category: t.category,
                                          amount: t.amount,
                                          type: t.type,
                                        });
                                      }}
                                      className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      setTransactions(
                                        transactions.filter(
                                          (item) => item.id !== t.id,
                                        ),
                                      )
                                    }
                                    className="text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatCard = ({ title, amount, icon, theme, format }) => {
  const colors = {
    indigo: "bg-indigo-600 text-white shadow-indigo-200",
    emerald: "bg-white text-emerald-600 border border-emerald-100",
    rose: "bg-white text-rose-500 border border-rose-100",
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-8 rounded-[2rem] shadow-lg ${colors[theme]}`}
    >
      <div
        className={`p-3 rounded-2xl w-fit mb-4 ${theme === "indigo" ? "bg-white/20" : "bg-slate-50"}`}
      >
        {icon}
      </div>
      <p
        className={`text-[10px] font-black uppercase tracking-widest ${theme === "indigo" ? "text-indigo-100" : "text-slate-400"}`}
      >
        {title}
      </p>
      <h3 className="text-3xl font-black mt-1">{format(amount)}</h3>
    </motion.div>
  );
};

const ChartWrapper = ({ title, icon, children }) => (
  <div className="bg-white/80 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-6 text-indigo-600">
      {icon}{" "}
      <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default Dashboard;