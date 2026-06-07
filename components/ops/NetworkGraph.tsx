'use client'

import { useEffect, useRef, useState, useMemo } from 'react'

interface NetworkGraphProps {
  nodes?: number
  className?: string
}

interface GraphNode {
  id: number
  x: number
  y: number
  type: 'friendly' | 'hostile' | 'unknown'
  label: string
  pulsePhase: number
  radius: number
}

interface GraphEdge {
  from: number
  to: number
  progress: number // 0-1 animation progress
}

const NODE_LABELS = [
  'SRV-01', 'NODE-7', 'PROXY-3', 'GW-12', 'DB-MAIN',
  'CDN-EU', 'API-US', 'CACHE-1', 'AUTH-2', 'LOG-SRV',
  'RELAY-5', 'DNS-PRI', 'EDGE-9', 'VAULT-0', 'SCAN-4',
  'MON-11', 'BKUP-6', 'LB-WEST', 'MQ-3', 'K8S-01',
]

function getNodeColor(type: GraphNode['type']): string {
  switch (type) {
    case 'friendly': return '#00ff41'
    case 'hostile': return '#ff1744'
    case 'unknown': return '#666666'
  }
}

export default function NetworkGraph({
  nodes: nodeCount = 18,
  className = '',
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)

  // Generate stable node positions
  const graphNodes = useMemo<GraphNode[]>(() => {
    const result: GraphNode[] = []
    const count = Math.min(nodeCount, 20)

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
      const radius = 80 + Math.random() * 80
      const x = 200 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40
      const y = 150 + Math.sin(angle) * radius + (Math.random() - 0.5) * 30

      const r = Math.random()
      const type = r < 0.5 ? 'friendly' : r < 0.75 ? 'hostile' : 'unknown'

      result.push({
        id: i,
        x: Math.max(20, Math.min(380, x)),
        y: Math.max(20, Math.min(280, y)),
        type,
        label: NODE_LABELS[i % NODE_LABELS.length],
        pulsePhase: Math.random() * Math.PI * 2,
        radius: 3 + Math.random() * 2,
      })
    }
    return result
  }, [nodeCount])

  // Generate edges
  const [edges, setEdges] = useState<GraphEdge[]>([])

  useEffect(() => {
    // Initial edges: connect nearby nodes
    const initialEdges: GraphEdge[] = []
    for (let i = 0; i < graphNodes.length; i++) {
      for (let j = i + 1; j < graphNodes.length; j++) {
        const dx = graphNodes[i].x - graphNodes[j].x
        const dy = graphNodes[i].y - graphNodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100 && Math.random() < 0.5) {
          initialEdges.push({ from: i, to: j, progress: 1 })
        }
      }
    }
    setEdges(initialEdges)

    // Occasionally add new connections
    const addEdge = () => {
      setEdges((prev) => {
        if (prev.length > graphNodes.length * 1.5) return prev
        const from = Math.floor(Math.random() * graphNodes.length)
        let to = Math.floor(Math.random() * graphNodes.length)
        if (from === to) to = (to + 1) % graphNodes.length

        // Check if edge already exists
        const exists = prev.some(
          (e) =>
            (e.from === from && e.to === to) ||
            (e.from === to && e.to === from)
        )
        if (exists) return prev

        return [...prev, { from, to, progress: 0 }]
      })
    }

    const interval = setInterval(addEdge, 3000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [graphNodes])

  // Animation loop for pulse and edge draw-in
  useEffect(() => {
    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001

      // Animate edge progress
      setEdges((prev) =>
        prev.map((e) =>
          e.progress < 1
            ? { ...e, progress: Math.min(1, e.progress + 0.02) }
            : e
        )
      )

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const time = timeRef.current

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0,255,65,0.1))' }}
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const fromNode = graphNodes[edge.from]
          const toNode = graphNodes[edge.to]
          if (!fromNode || !toNode) return null

          const dx = toNode.x - fromNode.x
          const dy = toNode.y - fromNode.y
          const endX = fromNode.x + dx * edge.progress
          const endY = fromNode.y + dy * edge.progress

          // Color based on node types
          const isHostile =
            fromNode.type === 'hostile' || toNode.type === 'hostile'
          const color = isHostile
            ? 'rgba(255,23,68,0.2)'
            : 'rgba(0,255,65,0.15)'

          return (
            <line
              key={`edge-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={endX}
              y2={endY}
              stroke={color}
              strokeWidth="1"
              strokeDasharray={edge.progress < 1 ? '4 2' : 'none'}
            />
          )
        })}

        {/* Nodes */}
        {graphNodes.map((node) => {
          const color = getNodeColor(node.type)
          const pulseScale =
            1 + 0.3 * Math.sin(time * 2 + node.pulsePhase)
          const isHovered = hoveredNode === node.id

          return (
            <g key={node.id}>
              {/* Pulse ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius * pulseScale * 2.5}
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                opacity={0.15 + 0.1 * Math.sin(time * 2 + node.pulsePhase)}
              />

              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? node.radius * 1.8 : node.radius}
                fill={color}
                opacity={isHovered ? 1 : 0.7}
                style={{
                  filter: `drop-shadow(0 0 ${isHovered ? 8 : 3}px ${color}60)`,
                  cursor: 'pointer',
                  transition: 'r 0.2s ease',
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />

              {/* Label on hover */}
              {isHovered && (
                <>
                  <rect
                    x={node.x - 24}
                    y={node.y - 22}
                    width="48"
                    height="14"
                    rx="2"
                    fill="rgba(0,0,0,0.85)"
                    stroke={color}
                    strokeWidth="0.5"
                  />
                  <text
                    x={node.x}
                    y={node.y - 12}
                    textAnchor="middle"
                    fill={color}
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
