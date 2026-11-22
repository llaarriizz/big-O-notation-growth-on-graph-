import { useEffect, useMemo, useState } from 'react'

type StructureId = 'array' | 'linked' | 'stack' | 'queue' | 'hash' | 'tree' | 'graph'

type StructureMeta = {
  id: StructureId
  name: string
  tagline: string
  operations: { op: string; cost: string }[]
}

const STRUCTURES: StructureMeta[] = [
  {
    id: 'array',
    name: 'Array',
    tagline: 'Values stored next to each other in memory, each with an index.',
    operations: [
      { op: 'Access by index', cost: 'O(1)' },
      { op: 'Search', cost: 'O(n)' },
      { op: 'Insert / delete', cost: 'O(n)' },
    ],
  },
  {
    id: 'linked',
    name: 'Linked List',
    tagline: 'Nodes linked by pointers. Easy to grow, slower to search.',
    operations: [
      { op: 'Insert at head', cost: 'O(1)' },
      { op: 'Access by index', cost: 'O(n)' },
      { op: 'Search', cost: 'O(n)' },
    ],
  },
  {
    id: 'stack',
    name: 'Stack',
    tagline: 'Last in, first out (LIFO). Think of a pile of plates.',
    operations: [
      { op: 'Push / pop', cost: 'O(1)' },
      { op: 'Peek top', cost: 'O(1)' },
      { op: 'Search', cost: 'O(n)' },
    ],
  },
  {
    id: 'queue',
    name: 'Queue',
    tagline: 'First in, first out (FIFO). Think of a line at a store.',
    operations: [
      { op: 'Enqueue / dequeue', cost: 'O(1)' },
      { op: 'Peek front', cost: 'O(1)' },
      { op: 'Search', cost: 'O(n)' },
    ],
  },
  {
    id: 'hash',
    name: 'Hash Table',
    tagline: 'Maps keys to values using a hash function and buckets.',
    operations: [
      { op: 'Insert (average)', cost: 'O(1)' },
      { op: 'Lookup (average)', cost: 'O(1)' },
      { op: 'Worst case', cost: 'O(n)' },
    ],
  },
  {
    id: 'tree',
    name: 'Binary Tree',
    tagline: 'Each node has at most two children. This one is a binary search tree.',
    operations: [
      { op: 'Search (balanced)', cost: 'O(log n)' },
      { op: 'Insert (balanced)', cost: 'O(log n)' },
      { op: 'Worst case', cost: 'O(n)' },
    ],
  },
  {
    id: 'graph',
    name: 'Graph',
    tagline: 'Nodes connected by edges. Great for relationships and networks.',
    operations: [
      { op: 'BFS / DFS', cost: 'O(V + E)' },
      { op: 'Add edge', cost: 'O(1)' },
      { op: 'Adjacency list space', cost: 'O(V + E)' },
    ],
  },
]

const randomValue = () => Math.floor(Math.random() * 90) + 10

function OperationTable({ rows }: { rows: { op: string; cost: string }[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800">
      {rows.map((row, i) => (
        <div
          key={row.op}
          className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${
            i % 2 === 0 ? 'bg-slate-950/50' : 'bg-slate-950/20'
          }`}
        >
          <span className="text-slate-300">{row.op}</span>
          <span className="shrink-0 font-mono font-semibold text-sky-400">{row.cost}</span>
        </div>
      ))}
    </div>
  )
}

function ArrayView() {
  const [values, setValues] = useState<number[]>(() => Array.from({ length: 8 }, randomValue))
  const [index, setIndex] = useState(0)
  const [newValue, setNewValue] = useState(42)
  const [active, setActive] = useState<number | null>(null)
  const [message, setMessage] = useState('Click any cell to access it directly by index.')

  const read = (i: number) => {
    setActive(i)
    setIndex(i)
    setMessage(`array[${i}] → ${values[i]}. Direct access takes one step: O(1).`)
  }

  const write = () => {
    setValues((prev) => prev.map((v, i) => (i === index ? newValue : v)))
    setActive(index)
    setMessage(`Wrote ${newValue} to index ${index}. Shifting items to insert would take O(n).`)
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-5">
        <div className="min-w-[560px]">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>index</span>
            <span>contiguous memory</span>
          </div>
          <div className="flex gap-1">
            {values.map((value, i) => (
              <button
                key={i}
                onClick={() => read(i)}
                className={`flex h-20 flex-1 flex-col items-center justify-center rounded-md border transition ${
                  active === i ? 'border-sky-400 bg-sky-500/20' : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                }`}
              >
                <span className="text-[11px] text-slate-500">{i}</span>
                <span className="font-mono text-lg font-semibold text-slate-100">{value}</span>
                <span className="text-[10px] text-slate-600">0x{(i * 4).toString(16).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Index</span>
          <select
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          >
            {values.map((_, i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">New value</span>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(Number(e.target.value))}
            className="w-28 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
          />
        </label>
        <button onClick={write} className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">Set value</button>
        <button
          onClick={() => { setValues(Array.from({ length: 8 }, randomValue)); setActive(null); setMessage('New random array generated.') }}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Randomize
        </button>
      </div>
      <p className="rounded-md bg-slate-950/60 px-4 py-3 text-sm text-slate-300">{message}</p>
    </div>
  )
}

function LinkedListView() {
  const [values, setValues] = useState<number[]>([12, 7, 23, 4, 18])
  const [target, setTarget] = useState(23)
  const [visited, setVisited] = useState<number[]>([])
  const [message, setMessage] = useState('Each node stores a value and a pointer to the next node.')

  const address = (i: number) => `0x${(0xa0 + i * 16).toString(16).toUpperCase()}`

  const search = () => {
    const found = values.indexOf(target)
    const seen = found === -1 ? values.map((_, i) => i) : values.map((_, i) => i).slice(0, found + 1)
    setVisited(seen)
    setMessage(
      found === -1
        ? `${target} is not in the list. We had to follow every pointer: O(n).`
        : `Found ${target} at node ${found} after ${seen.length} steps. Search is O(n).`,
    )
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-5">
        <div className="flex min-w-[620px] items-center">
          {values.map((value, i) => (
            <div key={`${i}-${value}`} className="flex items-center">
              <div
                className={`w-28 rounded-lg border-2 p-2 text-center transition ${
                  visited.includes(i) ? 'border-sky-400 bg-sky-500/15' : 'border-slate-700 bg-slate-800/70'
                }`}
                title={`Node at ${address(i)}`}
              >
                <div className="border-b border-slate-700 pb-1 font-mono text-base font-semibold text-slate-100">{value}</div>
                <div className="pt-1 font-mono text-[10px] text-slate-400">
                  next: {i + 1 < values.length ? address(i + 1) : 'null'}
                </div>
              </div>
              <div className="flex w-8 items-center justify-center">
                <div className="h-0.5 flex-1 bg-slate-600" />
                <span className="text-slate-500">▶</span>
              </div>
            </div>
          ))}
          <div className="rounded-md border border-dashed border-slate-700 px-3 py-4 font-mono text-xs text-slate-500">null</div>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <button
          onClick={() => { setValues((v) => [randomValue(), ...v]); setVisited([]); setMessage('Prepended a new head node in O(1) time.') }}
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          Prepend
        </button>
        <button
          onClick={() => { setValues((v) => [...v, randomValue()]); setVisited([]); setMessage('Appended a node at the tail.') }}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Append
        </button>
        <button
          onClick={() => { setValues((v) => v.slice(1)); setVisited([]); setMessage('Removed the head node in O(1) time.') }}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Remove head
        </button>
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Search for</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-28 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
          />
        </label>
        <button onClick={search} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Follow pointers</button>
        <button
          onClick={() => { setValues([12, 7, 23, 4, 18]); setVisited([]); setMessage('List reset.') }}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
      <p className="rounded-md bg-slate-950/60 px-4 py-3 text-sm text-slate-300">{message}</p>
    </div>
  )
}

function StackView() {
  const [items, setItems] = useState<number[]>([12, 7, 23, 4])
  const [message, setMessage] = useState('Push adds to the top. Pop removes from the top.')

  const push = () => {
    if (items.length >= 8) {
      setMessage('Stack is full (visualized at 8 items).')
      return
    }
    const value = randomValue()
    setItems([...items, value])
    setMessage(`Pushed ${value} onto the top in O(1).`)
  }

  const pop = () => {
    if (items.length === 0) {
      setMessage('Stack is empty — nothing to pop.')
      return
    }
    const value = items[items.length - 1]
    setItems(items.slice(0, -1))
    setMessage(`Popped ${value} from the top in O(1).`)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
        <div className="mx-auto flex max-w-sm flex-col-reverse gap-2">
          {items.length === 0 && (
            <div className="rounded-md border border-dashed border-slate-700 py-6 text-center text-sm text-slate-500">empty stack</div>
          )}
          {items.map((value, i) => {
            const isTop = i === items.length - 1
            return (
              <div
                key={`${i}-${value}`}
                className={`flex items-center justify-between rounded-md border px-4 py-3 transition ${
                  isTop ? 'border-sky-400 bg-sky-500/15' : 'border-slate-700 bg-slate-800/70'
                }`}
              >
                <span className="font-mono text-lg font-semibold text-slate-100">{value}</span>
                {isTop && <span className="rounded bg-sky-500 px-2 py-0.5 text-xs font-semibold text-slate-950">TOP</span>}
              </div>
            )
          })}
          <div className="border-t border-dashed border-slate-700 pt-2 text-center text-xs text-slate-500">bottom</div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={push} className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">Push</button>
        <button onClick={pop} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Pop</button>
        <button onClick={() => { setItems([]); setMessage('Stack cleared.') }} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Clear</button>
        <span className="text-xs text-slate-500">{items.length} / 8 shown</span>
      </div>
      <p className="rounded-md bg-slate-950/60 px-4 py-3 text-sm text-slate-300">{message}</p>
    </div>
  )
}

function QueueView() {
  const [items, setItems] = useState<number[]>([12, 7, 23, 4])
  const [message, setMessage] = useState('Enqueue adds to the rear. Dequeue removes from the front.')

  const enqueue = () => {
    if (items.length >= 8) {
      setMessage('Queue is full (visualized at 8 items).')
      return
    }
    const value = randomValue()
    setItems([...items, value])
    setMessage(`Enqueued ${value} at the rear in O(1).`)
  }

  const dequeue = () => {
    if (items.length === 0) {
      setMessage('Queue is empty — nothing to dequeue.')
      return
    }
    const value = items[0]
    setItems(items.slice(1))
    setMessage(`Dequeued ${value} from the front in O(1).`)
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-5">
        <div className="flex min-w-[480px] items-stretch gap-2">
          <div className="flex w-16 flex-col justify-center rounded-md border border-dashed border-slate-700 text-center text-xs text-slate-500">out ◀</div>
          {items.length === 0 && (
            <div className="flex-1 rounded-md border border-dashed border-slate-700 py-8 text-center text-sm text-slate-500">empty queue</div>
          )}
          {items.map((value, i) => {
            const isFront = i === 0
            const isRear = i === items.length - 1
            return (
              <div
                key={`${i}-${value}`}
                className={`flex h-20 flex-1 flex-col items-center justify-center rounded-md border transition ${
                  isFront || isRear ? 'border-sky-400 bg-sky-500/15' : 'border-slate-700 bg-slate-800/70'
                }`}
              >
                <span className="font-mono text-lg font-semibold text-slate-100">{value}</span>
                {(isFront || isRear) && (
                  <span className="mt-1 text-[10px] font-semibold uppercase text-sky-400">
                    {isFront && isRear ? 'front / rear' : isFront ? 'front' : 'rear'}
                  </span>
                )}
              </div>
            )
          })}
          <div className="flex w-16 flex-col justify-center rounded-md border border-dashed border-slate-700 text-center text-xs text-slate-500">▶ in</div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={enqueue} className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">Enqueue</button>
        <button onClick={dequeue} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Dequeue</button>
        <button onClick={() => { setItems([]); setMessage('Queue cleared.') }} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Clear</button>
        <span className="text-xs text-slate-500">{items.length} / 8 shown</span>
      </div>
      <p className="rounded-md bg-slate-950/60 px-4 py-3 text-sm text-slate-300">{message}</p>
    </div>
  )
}

type HashEntry = { key: string; value: string }
const BUCKET_COUNT = 8

function hashKey(key: string): number {
  let total = 0
  for (const char of key) total += char.charCodeAt(0)
  return total % BUCKET_COUNT
}

function HashTableView() {
  const [buckets, setBuckets] = useState<HashEntry[][]>(() => {
    const next: HashEntry[][] = Array.from({ length: BUCKET_COUNT }, () => [])
    const seed: HashEntry[] = [
      { key: 'apple', value: '3' },
      { key: 'banana', value: '5' },
      { key: 'carrot', value: '2' },
      { key: 'date', value: '7' },
    ]
    seed.forEach((entry) => next[hashKey(entry.key)].push(entry))
    return next
  })
  const [key, setKey] = useState('grape')
  const [value, setValue] = useState('9')
  const [highlight, setHighlight] = useState<number | null>(null)
  const [message, setMessage] = useState('A hash function turns a key into a bucket index.')

  const insert = () => {
    const cleanKey = key.trim()
    if (!cleanKey) {
      setMessage('Enter a key first.')
      return
    }
    const bucket = hashKey(cleanKey)
    const existing = buckets[bucket].findIndex((entry) => entry.key === cleanKey)
    setBuckets((prev) => {
      const next = prev.map((entries) => [...entries])
      if (existing >= 0) next[bucket][existing] = { key: cleanKey, value: value.trim() }
      else next[bucket].push({ key: cleanKey, value: value.trim() })
      return next
    })
    setHighlight(bucket)
    setMessage(
      existing >= 0
        ? `"${cleanKey}" already existed, so its value was updated in bucket ${bucket}.`
        : `"${cleanKey}" hashed to bucket ${bucket}. Collisions form a chain in the same bucket.`,
    )
  }

  const find = () => {
    const cleanKey = key.trim()
    const bucket = hashKey(cleanKey)
    setHighlight(bucket)
    const entry = buckets[bucket].find((item) => item.key === cleanKey)
    setMessage(
      entry
        ? `hash("${cleanKey}") = ${bucket}; found value "${entry.value}" there.`
        : `hash("${cleanKey}") = ${bucket}; no entry with that key in this bucket.`,
    )
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4">
        <div className="min-w-[420px] space-y-1.5">
          {buckets.map((entries, i) => (
            <div
              key={i}
              className={`flex min-h-11 items-center gap-2 rounded-md border px-3 py-1.5 transition ${
                highlight === i ? 'border-sky-400 bg-sky-500/10' : 'border-transparent'
              }`}
            >
              <span className="w-12 shrink-0 font-mono text-sm font-semibold text-slate-500">{i}</span>
              <div className="h-6 w-4 border-l-2 border-slate-700" />
              {entries.length === 0 && <span className="font-mono text-xs text-slate-600">null</span>}
              {entries.map((entry, j) => (
                <div key={`${entry.key}-${j}`} className="flex items-center gap-2">
                  <span className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-xs text-slate-200">
                    "{entry.key}" : "{entry.value}"
                  </span>
                  <span className="text-slate-600">→</span>
                </div>
              ))}
              {entries.length > 0 && <span className="font-mono text-xs text-slate-600">null</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Key</span>
          <input value={key} onChange={(e) => setKey(e.target.value)} className="w-32 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500" />
        </label>
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Value</span>
          <input value={value} onChange={(e) => setValue(e.target.value)} className="w-32 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500" />
        </label>
        <button onClick={insert} className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">Insert</button>
        <button onClick={find} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Look up</button>
      </div>
      <p className="rounded-md bg-slate-950/60 px-4 py-3 text-sm text-slate-300">{message}</p>
    </div>
  )
}

type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null }

function insertNode(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null }
  if (value < root.value) return { ...root, left: insertNode(root.left, value) }
  if (value > root.value) return { ...root, right: insertNode(root.right, value) }
  return root
}

function makeTree(values: number[]): TreeNode | null {
  return values.reduce<TreeNode | null>((root, value) => insertNode(root, value), null)
}

function layoutTree(root: TreeNode | null) {
  const nodes: { value: number; x: number; y: number }[] = []
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = []
  let column = 0

  const walk = (node: TreeNode | null, depth: number): { x: number; y: number } | null => {
    if (!node) return null
    const left = walk(node.left, depth + 1)
    const pos = { x: 48 + column++ * 62, y: 44 + depth * 76 }
    nodes.push({ value: node.value, ...pos })
    if (left) edges.push({ x1: pos.x, y1: pos.y, x2: left.x, y2: left.y })
    const right = walk(node.right, depth + 1)
    if (right) edges.push({ x1: pos.x, y1: pos.y, x2: right.x, y2: right.y })
    return pos
  }

  walk(root, 0)
  const width = Math.max(360, ...nodes.map((node) => node.x + 48))
  const height = Math.max(240, ...nodes.map((node) => node.y + 48))
  return { nodes, edges, width, height }
}

function TreeView() {
  const [root, setRoot] = useState<TreeNode | null>(() => makeTree([50, 30, 70, 20, 40, 60, 80]))
  const [value, setValue] = useState(45)
  const [visited, setVisited] = useState<number[]>([])
  const [message, setMessage] = useState('Smaller values go left, larger values go right.')

  const layout = useMemo(() => layoutTree(root), [root])

  const insert = () => {
    setRoot((prev) => insertNode(prev, value))
    setVisited([])
    setMessage(`Inserted ${value}. In a balanced tree this takes O(log n).`)
  }

  const search = () => {
    const seen: number[] = []
    let current = root
    while (current && seen.length < 100) {
      seen.push(current.value)
      if (value === current.value) break
      current = value < current.value ? current.left : current.right
    }
    setVisited(seen)
    setMessage(
      current?.value === value
        ? `Found ${value} after visiting ${seen.length} nodes.`
        : `${value} is not in the tree. Visited ${seen.length} nodes.`,
    )
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4">
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="h-72 w-full min-w-[360px]" role="img" aria-label="Binary search tree">
          {layout.edges.map((edge, i) => (
            <line key={i} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#475569" strokeWidth={2} />
          ))}
          {layout.nodes.map((node) => {
            const seen = visited.includes(node.value)
            return (
              <g key={node.value}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={seen ? '#38bdf8' : '#1e293b'}
                  stroke={seen ? '#7dd3fc' : '#64748b'}
                  strokeWidth={2}
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white font-mono text-sm">
                  {node.value}
                </text>
              </g>
            )
          })}
          {layout.nodes.length === 0 && <text x={20} y={40} className="fill-slate-500">Empty tree</text>}
        </svg>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Value</span>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-28 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-sky-500" />
        </label>
        <button onClick={insert} className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">Insert</button>
        <button onClick={search} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Search</button>
        <button
          onClick={() => { setRoot(makeTree([50, 30, 70, 20, 40, 60, 80])); setVisited([]); setMessage('Tree reset.') }}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Reset
        </button>
        <button
          onClick={() => { setRoot(null); setVisited([]); setMessage('Tree cleared.') }}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Clear
        </button>
      </div>
      <p className="rounded-md bg-slate-950/60 px-4 py-3 text-sm text-slate-300">{message}</p>
    </div>
  )
}

const GRAPH_NODES = [
  { id: 'A', x: 80, y: 60 },
  { id: 'B', x: 210, y: 40 },
  { id: 'C', x: 340, y: 110 },
  { id: 'D', x: 210, y: 180 },
  { id: 'E', x: 80, y: 220 },
  { id: 'F', x: 350, y: 235 },
]

const GRAPH_EDGES: [string, string][] = [
  ['A', 'B'], ['A', 'E'], ['B', 'C'], ['B', 'D'],
  ['C', 'D'], ['C', 'F'], ['D', 'E'], ['D', 'F'],
]

function traverse(mode: 'bfs' | 'dfs', start: string): string[] {
  const adjacency: Record<string, string[]> = {}
  GRAPH_NODES.forEach((node) => { adjacency[node.id] = [] })
  GRAPH_EDGES.forEach(([a, b]) => {
    adjacency[a].push(b)
    adjacency[b].push(a)
  })

  const order: string[] = []
  const seen = new Set<string>()

  if (mode === 'bfs') {
    const queue = [start]
    while (queue.length) {
      const current = queue.shift()!
      if (seen.has(current)) continue
      seen.add(current)
      order.push(current)
      adjacency[current].forEach((next) => { if (!seen.has(next)) queue.push(next) })
    }
  } else {
    const stack = [start]
    while (stack.length) {
      const current = stack.pop()!
      if (seen.has(current)) continue
      seen.add(current)
      order.push(current)
      ;[...adjacency[current]].reverse().forEach((next) => { if (!seen.has(next)) stack.push(next) })
    }
  }
  return order
}

function GraphView() {
  const [mode, setMode] = useState<'bfs' | 'dfs'>('bfs')
  const [start, setStart] = useState('A')
  const [order, setOrder] = useState<string[]>([])
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const adjacency = useMemo(() => {
    const map: Record<string, string[]> = {}
    GRAPH_NODES.forEach((node) => { map[node.id] = [] })
    GRAPH_EDGES.forEach(([a, b]) => { map[a].push(b); map[b].push(a) })
    return map
  }, [])

  useEffect(() => {
    if (!playing) return
    if (step >= order.length - 1) {
      setPlaying(false)
      return
    }
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= order.length - 1) {
          window.clearInterval(id)
          return s
        }
        return s + 1
      })
    }, 600)
    return () => window.clearInterval(id)
  }, [playing, step, order.length])

  const visited = order.slice(0, step + 1)
  const visitedSet = new Set(visited)
  const current = order[step]

  const run = () => {
    const next = traverse(mode, start)
    setOrder(next)
    setStep(0)
    setPlaying(true)
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 430 290" className="h-72 w-full min-w-[380px]" role="img" aria-label="Undirected graph">
          {GRAPH_EDGES.map(([a, b]) => {
            const from = GRAPH_NODES.find((node) => node.id === a)!
            const to = GRAPH_NODES.find((node) => node.id === b)!
            const used = visitedSet.has(a) && visitedSet.has(b)
            return <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={used ? '#38bdf8' : '#475569'} strokeWidth={used ? 3 : 2} />
          })}
          {GRAPH_NODES.map((node) => {
            const isVisited = visitedSet.has(node.id)
            const isCurrent = current === node.id
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill={isCurrent ? '#22c55e' : isVisited ? '#38bdf8' : '#1e293b'}
                  stroke={isVisited ? '#7dd3fc' : '#64748b'}
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={isVisited ? '#0f172a' : '#e2e8f0'}
                  className="font-mono text-sm font-bold"
                >
                  {node.id}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="mt-2 overflow-x-auto font-mono text-xs text-slate-400">
          {GRAPH_NODES.map((node) => (
            <div key={node.id} className="whitespace-nowrap">{node.id} → {adjacency[node.id].join(', ')}</div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Traversal</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'bfs' | 'dfs')} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100">
            <option value="bfs">Breadth-first (BFS)</option>
            <option value="dfs">Depth-first (DFS)</option>
          </select>
        </label>
        <label className="text-sm text-slate-300">
          <span className="mb-1 block">Start at</span>
          <select value={start} onChange={(e) => setStart(e.target.value)} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100">
            {GRAPH_NODES.map((node) => <option key={node.id} value={node.id}>{node.id}</option>)}
          </select>
        </label>
        <button onClick={run} className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">Run traversal</button>
        <button onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)) }} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Back</button>
        <button onClick={() => { setPlaying(false); setStep((s) => Math.min(Math.max(order.length - 1, 0), s + 1)) }} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Forward</button>
        <button onClick={() => { setPlaying(false); setStep(0) }} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Reset</button>
      </div>
      <div className="rounded-md bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
        <span className="text-slate-500">Visit order:</span>{' '}
        {order.length === 0 ? (
          <span className="text-slate-500">Run a traversal to see the order.</span>
        ) : (
          order.map((id, i) => (
            <span key={`${id}-${i}`} className={i <= step ? 'font-mono font-semibold text-sky-400' : 'font-mono text-slate-600'}>
              {i > 0 && <span className="text-slate-600"> → </span>}
              {id}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export default function DataStructuresVisualizer() {
  const [selectedId, setSelectedId] = useState<StructureId>('array')
  const selected = STRUCTURES.find((structure) => structure.id === selectedId) ?? STRUCTURES[0]

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Data Structures Visualizer</h2>
          <p className="text-slate-400">See how common data structures store data and what their operations cost.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STRUCTURES.map((structure) => (
            <button
              key={structure.id}
              onClick={() => setSelectedId(structure.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium border ${
                selectedId === structure.id
                  ? 'bg-sky-500 text-slate-950 border-sky-500'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {structure.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{selected.tagline}</p>
          </div>
          {selectedId === 'array' && <ArrayView />}
          {selectedId === 'linked' && <LinkedListView />}
          {selectedId === 'stack' && <StackView />}
          {selectedId === 'queue' && <QueueView />}
          {selectedId === 'hash' && <HashTableView />}
          {selectedId === 'tree' && <TreeView />}
          {selectedId === 'graph' && <GraphView />}
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-white">Common operations</h3>
          <OperationTable rows={selected.operations} />
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
            <div className="mb-1 font-semibold text-slate-300">How to read this</div>
            <p>
              O(1) stays constant as the structure grows. O(log n) grows slowly, O(n) grows with the number of items,
              and O(n²) grows with the square. The highlighted items show what happens during each operation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
