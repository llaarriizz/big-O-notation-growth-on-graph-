import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts'

type Complexity = {
  id: string
  label: string
  color: string
  fn: (n: number) => number
  description: string
  code: string
}

const COMPLEXITIES: Complexity[] = [
  {
    id: 'o1',
    label: 'O(1)',
    color: '#22c55e',
    fn: () => 1,
    description: 'Constant time — same work regardless of input size.',
    code: `function constantTime(arr, n) {
  // N doesn't change the work here
  return arr[0];
}

console.log(constantTime([1,2,3], N));`,
  },
  {
    id: 'ologn',
    label: 'O(log n)',
    color: '#06b6d4',
    fn: (n) => Math.log2(Math.max(n, 1)),
    description: 'Logarithmic — grows slowly by halving the problem.',
    code: `function binarySearchSteps(n) {
  let steps = 0;
  let size = n;
  while (size > 1) {
    size = Math.floor(size / 2);
    steps++;
  }
  return steps;
}

console.log("steps for N:", binarySearchSteps(N));`,
  },
  {
    id: 'on',
    label: 'O(n)',
    color: '#3b82f6',
    fn: (n) => n,
    description: 'Linear — work grows directly with input size.',
    code: `function linearSum(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i;
  }
  return sum;
}

console.log("sum up to N:", linearSum(N));`,
  },
  {
    id: 'onlogn',
    label: 'O(n log n)',
    color: '#a855f7',
    fn: (n) => n * Math.log2(Math.max(n, 1)),
    description: 'Linearithmic — common in efficient sorting algorithms.',
    code: `function nLogNWork(n) {
  let ops = 0;
  for (let i = 0; i < n; i++) {
    let size = n;
    while (size > 1) {
      size = Math.floor(size / 2);
      ops++;
    }
  }
  return ops;
}

console.log("approx ops for N:", nLogNWork(N));`,
  },
  {
    id: 'on2',
    label: 'O(n²)',
    color: '#f59e0b',
    fn: (n) => n * n,
    description: 'Quadratic — nested loops over the input.',
    code: `function pairCount(n) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      count++;
    }
  }
  return count;
}

console.log("pairs for N:", pairCount(N));`,
  },
  {
    id: 'o2n',
    label: 'O(2^n)',
    color: '#ef4444',
    fn: (n) => Math.pow(2, n),
    description: 'Exponential — doubles with each additional element.',
    code: `// WARNING: slow for large N
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

console.log("fib(N):", fib(Math.min(N, 30)));`,
  },
  {
    id: 'onfact',
    label: 'O(n!)',
    color: '#f43f5e',
    fn: (n) => {
      if (n > 20) return Number.POSITIVE_INFINITY
      let r = 1
      for (let i = 2; i <= n; i++) r *= i
      return r
    },
    description: 'Factorial — explodes extremely fast; only tiny inputs.',
    code: `// WARNING: factorial grows insanely fast
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log("factorial(N):", factorial(Math.min(N, 20)));`,
  },
]

const MAX_CHART_Y = 100000

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞'
  if (Math.abs(value) >= 1_000_000) return value.toExponential(2)
  if (Math.abs(value) >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(2)
}

function buildChartData(maxN: number, visible: Set<string>, scale: 'linear' | 'log') {
  const points = Math.min(maxN, 50)
  const step = Math.max(1, Math.floor(maxN / points))
  const ns: number[] = []
  for (let n = 0; n <= maxN; n += step) ns.push(n)
  if (ns[ns.length - 1] !== maxN) ns.push(maxN)

  return ns.map((n) => {
    const row: Record<string, number | string> = { n }
    for (const c of COMPLEXITIES) {
      if (!visible.has(c.id)) continue
      const raw = c.fn(n)
      const finite = Number.isFinite(raw) ? raw : Number.POSITIVE_INFINITY
      row[`${c.id}_raw`] = finite
      if (scale === 'log') {
        row[c.id] = finite === Number.POSITIVE_INFINITY ? MAX_CHART_Y : Math.max(1, Math.min(finite, MAX_CHART_Y))
      } else {
        row[c.id] = finite === Number.POSITIVE_INFINITY ? MAX_CHART_Y * 1.2 : Math.min(finite, MAX_CHART_Y * 1.2)
      }
    }
    return row
  })
}

function runUserCode(code: string, n: number): { logs: string[]; error?: string } {
  const logs: string[] = []
  const fakeConsole = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
    error: (...args: unknown[]) => logs.push('[error] ' + args.map(String).join(' ')),
    warn: (...args: unknown[]) => logs.push('[warn] ' + args.map(String).join(' ')),
  }
  try {
    const fn = new Function('N', 'console', `"use strict";\n${code}`)
    const result = fn(n, fakeConsole)
    if (result !== undefined) logs.push(`=> ${String(result)}`)
  } catch (e) {
    return { logs, error: e instanceof Error ? e.message : String(e) }
  }
  return { logs }
}

export default function App() {
  const [n, setN] = useState(20)
  const [scale, setScale] = useState<'linear' | 'log'>('log')
  const [visible, setVisible] = useState<Set<string>>(() => new Set(COMPLEXITIES.map((c) => c.id)))
  const [selectedId, setSelectedId] = useState(COMPLEXITIES[2].id)
  const [code, setCode] = useState(COMPLEXITIES[2].code)
  const [output, setOutput] = useState<{ logs: string[]; error?: string } | null>(null)

  const selected = COMPLEXITIES.find((c) => c.id === selectedId) ?? COMPLEXITIES[0]

  const chartData = useMemo(() => buildChartData(n, visible, scale), [n, visible, scale])

  const toggle = (id: string) => {
    setVisible((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size === 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectComplexity = (id: string) => {
    setSelectedId(id)
    const c = COMPLEXITIES.find((x) => x.id === id)
    if (c) {
      setCode(c.code)
      setOutput(null)
    }
  }

  const handleRun = () => {
    setOutput(runUserCode(code, n))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Big O Notation Visualizer
          </h1>
          <p className="mt-2 max-w-3xl text-slate-400">
            See how different time complexities grow as your input size <span className="font-mono text-sky-400">N</span> increases.
            Pick complexities, inspect their growth, and run code with your own N.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-2">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Input size N: <span className="font-mono text-sky-400">{n}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={n}
                  onChange={(e) => setN(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>
              <div className="sm:w-28">
                <label className="mb-2 block text-sm font-medium text-slate-300">N value</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={n}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    if (Number.isFinite(v)) setN(Math.max(1, Math.min(50, Math.floor(v))))
                  }}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {COMPLEXITIES.map((c) => {
                const active = visible.has(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggle(c.id)}
                    className="rounded-full border px-3 py-1 text-sm font-medium transition"
                    style={{
                      borderColor: c.color,
                      color: active ? '#0f172a' : c.color,
                      backgroundColor: active ? c.color : 'transparent',
                      opacity: active ? 1 : 0.75,
                    }}
                  >
                    {c.label}
                  </button>
                )
              })}
              <div className="ml-auto flex rounded-md border border-slate-700 bg-slate-950 p-0.5 text-sm">
                <button
                  onClick={() => setScale('linear')}
                  className={`rounded px-3 py-1 ${scale === 'linear' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
                >
                  Linear
                </button>
                <button
                  onClick={() => setScale('log')}
                  className={`rounded px-3 py-1 ${scale === 'log' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
                >
                  Log
                </button>
              </div>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="n" stroke="#94a3b8" label={{ value: 'N', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} />
                  <YAxis
                    stroke="#94a3b8"
                    scale={scale === 'log' ? 'log' : 'auto'}
                    domain={scale === 'log' ? [1, MAX_CHART_Y] : [0, MAX_CHART_Y]}
                    allowDataOverflow
                    tickFormatter={(v) => formatNumber(v)}
                    width={72}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                    labelStyle={{ color: '#e2e8f0' }}
                    formatter={(value: number, name: string, item: any) => {
                      const raw = item?.payload?.[`${name}_raw`]
                      return [formatNumber(typeof raw === 'number' ? raw : value), COMPLEXITIES.find((c) => c.id === name)?.label ?? name]
                    }}
                    labelFormatter={(label) => `N = ${label}`}
                  />
                  <Legend formatter={(value) => COMPLEXITIES.find((c) => c.id === value)?.label ?? value} />
                  <ReferenceLine x={n} stroke="#38bdf8" strokeDasharray="4 4" />
                  {COMPLEXITIES.filter((c) => visible.has(c.id)).map((c) => (
                    <Line
                      key={c.id}
                      type="monotone"
                      dataKey={c.id}
                      stroke={c.color}
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {scale === 'log'
                ? 'Log scale makes slow-growing curves visible alongside fast ones. Values are exact in the table below.'
                : `Linear scale is capped at ${formatNumber(MAX_CHART_Y)} to keep fast-growing curves readable. Switch to Log to compare all curves.`}
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">Values at N = {n}</h2>
            <div className="space-y-2">
              {COMPLEXITIES.map((c) => {
                const value = c.fn(n)
                const active = visible.has(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => selectComplexity(c.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                      selectedId === c.id ? 'border-sky-500 bg-slate-800' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                    style={{ opacity: active ? 1 : 0.55 }}
                  >
                    <div>
                      <div className="font-mono text-sm font-semibold" style={{ color: c.color }}>{c.label}</div>
                      <div className="text-xs text-slate-500">{c.description}</div>
                    </div>
                    <div className="ml-3 shrink-0 font-mono text-sm text-slate-200">{formatNumber(value)}</div>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Code example</h2>
                <p className="text-sm text-slate-400">
                  <span className="font-mono" style={{ color: selected.color }}>{selected.label}</span> — {selected.description}
                </p>
              </div>
              <button
                onClick={() => { setCode(selected.code); setOutput(null) }}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Reset
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="h-72 w-full rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-sky-500"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleRun}
                className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              >
                Run with N = {n}
              </button>
              <span className="text-xs text-slate-500">
                Runs in your browser. <span className="font-mono">N</span> and <span className="font-mono">console.log</span> are available.
              </span>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">Output</h2>
            <div className="h-72 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-sm">
              {!output && <div className="text-slate-500">Run code to see output here.</div>}
              {output?.logs.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-words text-slate-200">{line}</div>
              ))}
              {output?.error && (
                <div className="mt-2 whitespace-pre-wrap break-words text-red-400">Error: {output.error}</div>
              )}
              {output && output.logs.length === 0 && !output.error && (
                <div className="text-slate-500">(no output)</div>
              )}
            </div>
            <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-400">
              <div className="font-semibold text-slate-300">Tip</div>
              Use <span className="font-mono text-slate-200">N</span> in your code for the current input size. For expensive examples like recursion, keep N small.
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
