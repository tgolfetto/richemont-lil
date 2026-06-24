"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type MonthlyDatum = {
  month: string;
  assigned: number;
  completed: number;
  active: number;
};

type MarketDatum = {
  market: string;
  completion: number;
};

const gold = "#B4975A";

export function LearningActivityChart({ data }: { data: MonthlyDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9f7f42" />
            <stop offset="100%" stopColor={gold} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#ece8de" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 20,
            border: "1px solid #e4d9bf",
            backgroundColor: "rgba(255,255,255,0.98)"
          }}
        />
        <Line type="monotone" dataKey="assigned" stroke="#18181b" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="completed" stroke="url(#goldStroke)" strokeWidth={3.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MarketCompletionChart({ data }: { data: MarketDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#ece8de" vertical={false} />
        <XAxis dataKey="market" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 20,
            border: "1px solid #e4d9bf",
            backgroundColor: "rgba(255,255,255,0.98)"
          }}
        />
        <Bar dataKey="completion" radius={[12, 12, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.market} fill={index % 2 === 0 ? gold : "#1f1f1f"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

