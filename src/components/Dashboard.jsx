import { useState } from "react";
import { transactions as initialData } from "../data/mockData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [role, setRole] = useState("viewer");
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  // Calculations
  const income = data
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = data
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  // Pie Chart Data
  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  // Line Chart Data (ONLY expenses for better graph)
  const trendData = data
  .filter((t) => t.type === "expense")
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .map((t) => ({
    date: t.date,
    amount: t.amount,
  }));

  // Insights
  const expensesOnly = data.filter((t) => t.type === "expense");

  const highestExpense =
    expensesOnly.length > 0
      ? Math.max(...expensesOnly.map((t) => t.amount))
      : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>

        <select
          className="border px-3 py-2 rounded-lg shadow-sm"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-gray-500">Balance</p>
          <h2 className="text-2xl font-bold text-blue-600">₹{balance}</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-gray-500">Income</p>
          <h2 className="text-2xl font-bold text-green-600">₹{income}</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">
          <p className="text-gray-500">Expenses</p>
          <h2 className="text-2xl font-bold text-red-600">₹{expense}</h2>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-md mb-6 flex justify-center">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">
            Income vs Expense
          </h2>

          <PieChart width={350} height={280}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name}: ₹${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Spending Trend</h2>

        <div className="flex justify-center">
          <LineChart width={500} height={250} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
          </LineChart>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white p-5 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Insights</h2>

        <p>💸 Highest Expense: ₹{highestExpense}</p>
        <p className="mt-2">📊 Total Transactions: {data.length}</p>
        <p className="mt-2">💰 Total Income: ₹{income}</p>
      </div>

      {/* Transactions */}
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search category..."
          className="border p-2 mb-4 rounded-lg w-full"
          onChange={(e) => setSearch(e.target.value)}
        />

        {data
          .filter((t) =>
            t.category.toLowerCase().includes(search.toLowerCase())
          )
          .map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center border-b py-3 text-sm"
            >
              <div>
                <p className="font-medium">{t.category}</p>
                <p className="text-gray-400 text-xs">{t.date}</p>
              </div>

              <p className="font-semibold">₹{t.amount}</p>

              <p
                className={
                  t.type === "income"
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {t.type}
              </p>
            </div>
          ))}
      </div>

      {/* Add Transaction */}
      {role === "admin" && (
        <div className="mt-6 bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target;

              const newTransaction = {
                id: Date.now(),
                category: form[0].value,
                amount: Number(form[1].value),
                type: form[2].value,
                date: new Date().toISOString().split("T")[0],
              };

              setData([newTransaction, ...data]);

              form.reset();
            }}
            className="grid gap-4 md:grid-cols-4"
          >
            <input
              type="text"
              placeholder="Category"
              className="border p-2 rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded-lg"
              required
            />

            <select className="border p-2 rounded-lg">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button className="bg-blue-600 text-white rounded-lg px-4">
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}