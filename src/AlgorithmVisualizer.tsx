import { useEffect, useMemo, useState } from 'react'

type Step = {
  array: number[]
  active: number[]
  sorted: number[]
  found?: number[]
  message: string
}

type Algorithm = {
  id: string
  name: string
  kind: 'sorting' | 'searching'
  complexity: string
  description: string
  code: string
  makeSteps: (arr: number[], target: number) => Step[]
}

function makeArray(n: number): number[] {
  const values = Array.from({ length: n }, (_, i) => i + 1)
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[values[i], values[j]] = [values[j], values[i]]
  }
  return values
}

function makeSortedArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1)
}

function bubbleSortSteps(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = [{ array: [...arr], active: [], sorted: [], message: 'Start bubble sort. Compare neighbors and swap when needed.' }]
  const sorted: number[] = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({ array: [...arr], active: [j, j + 1], sorted: [...sorted], message: `Compare ${arr[j]} and ${arr[j + 1]}.` })
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push({ array: [...arr], active: [j, j + 1], sorted: [...sorted], message: `Swap because ${arr[j + 1]} > ${arr[j]}.` })
      }
    }
    sorted.unshift(arr.length - i - 1)
    steps.push({ array: [...arr], active: [], sorted: [...sorted], message: `Position ${arr.length - i - 1} is now in its final place.` })
  }
  steps.push({ array: [...arr], active: [], sorted: arr.map((_, i) => i), message: 'Array is fully sorted.' })
  return steps
}

function selectionSortSteps(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = [{ array: [...arr], active: [], sorted: [], message: 'Start selection sort. Find the smallest item and place it at the front.' }]
  const sorted: number[] = []
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i
    steps.push({ array: [...arr], active: [i], sorted: [...sorted], message: `Look for the smallest value from index ${i}.` })
    for (let j = i + 1; j < arr.length; j++) {
      steps.push({ array: [...arr], active: [minIdx, j], sorted: [...sorted], message: `Compare current min ${arr[minIdx]} with ${arr[j]}.` })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({ array: [...arr], active: [minIdx], sorted: [...sorted], message: `New minimum found: ${arr[minIdx]}.` })
      }
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      steps.push({ array: [...arr], active: [i, minIdx], sorted: [...sorted], message: `Swap ${arr[minIdx]} and ${arr[i]} into position ${i}.` })
    }
    sorted.push(i)
    steps.push({ array: [...arr], active: [], sorted: [...sorted], message: `Index ${i} is now sorted.` })
  }
  steps.push({ array: [...arr], active: [], sorted: arr.map((_, i) => i), message: 'Array is fully sorted.' })
  return steps
}

function linearSearchSteps(input: number[], target: number): Step[] {
  const arr = [...input]
  const steps: Step[] = [{ array: [...arr], active: [], sorted: [], message: `Start linear search. Look for ${target} one item at a time.` }]
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], active: [i], sorted: [], message: `Check index ${i}: is ${arr[i]} equal to ${target}?` })
    if (arr[i] === target) {
      steps.push({ array: [...arr], active: [], sorted: [], found: [i], message: `Found ${target} at index ${i}!` })
      return steps
    }
  }
  steps.push({ array: [...arr], active: [], sorted: [], message: `${target} was not found in the array.` })
  return steps
}

function binarySearchSteps(input: number[], target: number): Step[] {
  const arr = [...input].sort((a, b) => a - b)
  const steps: Step[] = [{ array: [...arr], active: [], sorted: [], message: `Start binary search on a sorted array. Look for ${target}.` }]
  let low = 0
  let high = arr.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const range = Array.from({ length: high - low + 1 }, (_, i) => low + i)
    steps.push({ array: [...arr], active: [mid], sorted: range, message: `Check middle index ${mid}: value ${arr[mid]}. Search range is ${low}..${high}.` })
    if (arr[mid] === target) {
      steps.push({ array: [...arr], active: [], sorted: [], found: [mid], message: `Found ${target} at index ${mid}!` })
      return steps
    }
    if (arr[mid] < target) {
      steps.push({ array: [...arr], active: [mid], sorted: range, message: `${arr[mid]} < ${target}, so search the right half.` })
      low = mid + 1
    } else {
      steps.push({ array: [...arr], active: [mid], sorted: range, message: `${arr[mid]} > ${target}, so search the left half.` })
      high = mid - 1
    }
  }
  steps.push({ array: [...arr], active: [], sorted: [], message: `${target} was not found in the array.` })
  return steps
}

const ALGORITHMS: Algorithm[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    kind: 'sorting',
    complexity: 'O(n²)',
    description: 'Repeatedly compares neighbors and swaps them if they are in the wrong order.',
    code: `function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      // Compare neighbors
      if (a[j] > a[j + 1]) {
        // Swap if out of order
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}

console.log(bubbleSort([5, 2, 4, 1, 3]));`,
    makeSteps: (arr) => bubbleSortSteps(arr),
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    kind: 'sorting',
    complexity: 'O(n²)',
    description: 'Finds the smallest remaining item and moves it to its correct position.',
    code: `function selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let minIndex = i;
    // Find smallest value in the unsorted part
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIndex]) minIndex = j;
    }
    // Put it in the current position
    [a[i], a[minIndex]] = [a[minIndex], a[i]];
  }
  return a;
}

console.log(selectionSort([5, 2, 4, 1, 3]));`,
    makeSteps: (arr) => selectionSortSteps(arr),
  },
  {
    id: 'linear',
    name: 'Linear Search',
    kind: 'searching',
    complexity: 'O(n)',
    description: 'Checks each item one by one until it finds the target.',
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    // Check one item at a time
    if (arr[i] === target) {
      return i; // found it
    }
  }
  return -1; // not found
}

const arr = [4, 2, 7, 1, 9];
console.log("index:", linearSearch(arr, 7));`,
    makeSteps: (arr, target) => linearSearchSteps(arr, target),
  },
  {
    id: 'binary',
    name: 'Binary Search',
    kind: 'searching',
    complexity: 'O(log n)',
    description: 'Checks the middle of a sorted array and removes half the search space each step.',
    code: `function binarySearch(sortedArr, target) {
  let low = 0;
  let high = sortedArr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArr[mid] === target) return mid; // found
    if (sortedArr[mid] < target) low = mid + 1; // go right
    else high = mid - 1; // go left
  }
  return -1; // not found
}

const arr = [1, 2, 4, 7, 9];
console.log("index:", binarySearch(arr, 7));`,
    makeSteps: (arr, target) => binarySearchSteps(arr, target),
  },
]

export default function AlgorithmVisualizer() {
  const [selectedId, setSelectedId] = useState(ALGORITHMS[0].id)
  const [size, setSize] = useState(10)
  const [array, setArray] = useState<number[]>(() => makeArray(10))
  const [target, setTarget] = useState(6)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(450)

  const algo = ALGORITHMS.find((a) => a.id === selectedId) ?? ALGORITHMS[0]

  const steps = useMemo(() => algo.makeSteps(array, target), [algo, array, target])
  const step = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    setStepIndex(0)
    setPlaying(false)
  }, [algo.id, array, target])

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= steps.length - 1) {
      setPlaying(false)
      return
    }
    const id = window.setInterval(() => {
      setStepIndex((s) => {
        if (s >= steps.length - 1) {
          window.clearInterval(id)
          return s
        }
        return s + 1
      })
    }, speed)
    return () => window.clearInterval(id)
  }, [playing, speed, stepIndex, steps.length])

  const regenerate = () => {
    if (algo.kind === 'searching') {
      const next = makeSortedArray(size)
      setArray(next)
      setTarget(next[Math.floor(Math.random() * next.length)])
    } else {
      setArray(makeArray(size))
    }
  }

  const selectAlgo = (id: string) => {
    const next = ALGORITHMS.find((a) => a.id === id)
    setSelectedId(id)
    if (!next) return
    if (next.kind === 'searching') {
      const sorted = makeSortedArray(size)
      setArray(sorted)
      setTarget(sorted[Math.floor(Math.random() * sorted.length)])
    } else {
      setArray(makeArray(size))
    }
  }

  const maxValue = Math.max(...step.array, 1)

  return (
    <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Algorithm Visualizer</h2>
          <p className="text-slate-400">Watch sorting and searching algorithms step by step, with code examples.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((a) => (
            <button
              key={a.id}
              onClick={() => selectAlgo(a.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium border ${selectedId === a.id ? 'bg-sky-500 text-slate-950 border-sky-500' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="font-semibold text-white">{algo.name}</span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-sky-400">{algo.complexity}</span>
              <span className="text-slate-400">{algo.kind}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{algo.description}</p>
          </div>

          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="text-sm text-slate-300">
              <div className="mb-1">Size</div>
              <input
                type="range" min={5} max={16} value={size}
                onChange={(e) => {
                  const nextSize = Number(e.target.value)
                  setSize(nextSize)
                  if (algo.kind === 'searching') {
                    const next = makeSortedArray(nextSize)
                    setArray(next)
                    setTarget(next[Math.floor(Math.random() * next.length)])
                  } else {
                    setArray(makeArray(nextSize))
                  }
                }}
                className="w-36 accent-sky-500"
              />
              <span className="ml-2 font-mono text-sky-400">{size}</span>
            </label>
            {algo.kind === 'searching' && (
              <label className="text-sm text-slate-300">
                <div className="mb-1">Target</div>
                <select
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-slate-100"
                >
                  {makeSortedArray(size).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            )}
            <label className="text-sm text-slate-300">
              <div className="mb-1">Speed</div>
              <input type="range" min={100} max={900} step={50} value={1000 - speed}
                onChange={(e) => setSpeed(1000 - Number(e.target.value))}
                className="w-28 accent-sky-500" />
            </label>
            <button onClick={regenerate} className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800">New array</button>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <div className="flex h-56 items-end gap-1">
              {step.array.map((value, idx) => {
                const isActive = step.active.includes(idx)
                const isSorted = step.sorted.includes(idx)
                const isFound = step.found?.includes(idx)
                let bg = '#475569'
                if (isFound) bg = '#22c55e'
                else if (isActive) bg = '#38bdf8'
                else if (isSorted) bg = algo.kind === 'sorting' ? '#22c55e' : '#6366f1'
                return (
                  <div key={idx} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <div className="text-[10px] text-slate-400">{value}</div>
                    <div
                      className="w-full rounded-t transition-all duration-200"
                      style={{ height: `${Math.max(8, (value / maxValue) * 180)}px`, backgroundColor: bg }}
                      title={`${value}`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="mt-3 min-h-10 rounded-md bg-slate-900 px-3 py-2 text-sm text-slate-300">{step.message}</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (stepIndex >= steps.length - 1) {
                    setStepIndex(0)
                    setPlaying(true)
                    return
                  }
                  setPlaying((p) => !p)
                }}
                className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              >
                {playing ? 'Pause' : stepIndex >= steps.length - 1 ? 'Replay' : 'Play'}
              </button>
              <button
                onClick={() => { setPlaying(false); setStepIndex((s) => Math.max(0, s - 1)) }}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Step back
              </button>
              <button
                onClick={() => { setPlaying(false); setStepIndex((s) => Math.min(steps.length - 1, s + 1)) }}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Step forward
              </button>
              <button
                onClick={() => { setPlaying(false); setStepIndex(0) }}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Reset
              </button>
              <span className="ml-auto text-xs text-slate-500">Step {Math.min(stepIndex + 1, steps.length)} / {steps.length}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold text-white">Code example</h3>
          <pre className="h-[420px] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
            <code>{algo.code}</code>
          </pre>
          <div className="mt-3 flex gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-sky-400" /> active/checking</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-green-500" /> sorted/found</span>
            {algo.kind === 'searching' && <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-indigo-500" /> search range</span>}
          </div>
        </div>
      </div>
    </section>
  )
}
