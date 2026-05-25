import React, { useState, useRef, useEffect } from 'react';
import { rotationPlanes, rotateND, projectND } from '../../shared/ProjectionEngine.js';
import RotationControls from '../../shared/RotationControls.jsx';
import PuzzlePanel from '../../shared/PuzzlePanel.jsx';
import { buildVertices, buildEdges, buildCells } from './geometry.js';
import { penteractPuzzles } from './puzzles.js';

const N = 5;
const PLANES = rotationPlanes(N);
const INITIAL_ANGLES = Object.fromEntries(PLANES.map(p => [p.label, 0]));
// Default auto-spin on xv — mirrors Tesseract's xw default; first higher-dim plane involving v.
const INITIAL_SPIN = Object.fromEntries(PLANES.map(p => [p.label, p.label === 'xv']));

export default function Penteract() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    angles: { ...INITIAL_ANGLES },
    spin: { ...INITIAL_SPIN },
    markedVerts: new Set(),
    activeCell: null,
    projected: [],
  });

  const [, setTick] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const vertices = useRef(buildVertices()).current;
  const edges = useRef(buildEdges()).current;
  const cells = useRef(buildCells()).current;

  useEffect(() => {
    let last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const s = stateRef.current;
      let changed = false;
      for (const plane of PLANES) {
        if (s.spin[plane.label]) {
          s.angles[plane.label] += dt * 0.4;
          if (s.angles[plane.label] > Math.PI) s.angles[plane.label] -= 2 * Math.PI;
          if (s.angles[plane.label] < -Math.PI) s.angles[plane.label] += 2 * Math.PI;
          changed = true;
        }
      }
      if (changed) setTick(t => t + 1);
      drawFrame();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawFrame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== rect.width * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = rect.width, H = rect.height;
    const scale = Math.min(W, H) * 0.22;
    const s = stateRef.current;

    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let j = 0; j < H; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
    }

    const projected = vertices.map(v => {
      const rotated = rotateND(v, s.angles, PLANES);
      const p = projectND(rotated, { defaultDist: 3, zDist: 4 });
      return {
        x: W / 2 + p.x * scale,
        y: H / 2 + p.y * scale,
        wFactor: p.wFactor,
        w: rotated[3],
        v: rotated[4],
      };
    });
    s.projected = projected;

    for (const [i, j] of edges) {
      const a = projected[i], b = projected[j];
      const avgDepth = (a.w + a.v + b.w + b.v) / 4;
      const t = (avgDepth + 1) / 2;
      const r = Math.round(80 + 160 * t);
      const g = Math.round(140 + 60 * (1 - t));
      const bl = Math.round(220 - 120 * t);
      let alpha = 0.55;
      let lw = 1.2 + (avgDepth + 1) * 0.5;
      if (s.activeCell !== null) {
        const inCell = cells[s.activeCell].verts.includes(i) && cells[s.activeCell].verts.includes(j);
        alpha = inCell ? 1.0 : 0.12;
        if (inCell) lw = 3;
      }
      ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    projected.forEach((p, idx) => {
      const marked = s.markedVerts.has(idx);
      const size = marked ? 9 : 4 + p.wFactor * 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      if (marked) {
        ctx.fillStyle = '#ffd166';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        const avgDepth = (p.w + p.v) / 2;
        const t = (avgDepth + 1) / 2;
        ctx.fillStyle = `rgb(${Math.round(120 + 120 * t)}, ${Math.round(180 + 40 * (1 - t))}, ${Math.round(240 - 100 * t)})`;
        ctx.fill();
      }
    });
  }

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = stateRef.current;
    let best = -1, bestDist = 16;
    s.projected.forEach((p, idx) => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bestDist) { bestDist = d; best = idx; }
    });
    if (best >= 0) {
      if (s.markedVerts.has(best)) s.markedVerts.delete(best);
      else s.markedVerts.add(best);
      setTick(t => t + 1);
    }
  };

  const resetView = () => {
    const s = stateRef.current;
    for (const plane of PLANES) s.angles[plane.label] = 0;
    setTick(t => t + 1);
  };

  const clearMarks = () => {
    stateRef.current.markedVerts = new Set();
    setTick(t => t + 1);
  };

  const toggleCell = (i) => {
    const s = stateRef.current;
    s.activeCell = s.activeCell === i ? null : i;
    setTick(t => t + 1);
  };

  const onAngleChange = (label, value) => {
    stateRef.current.angles[label] = value;
    setTick(t => t + 1);
  };

  const onSpinChange = (label, checked) => {
    stateRef.current.spin[label] = checked;
    setTick(t => t + 1);
  };

  const s = stateRef.current;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: panelOpen ? '1fr 340px' : '1fr 0px',
      transition: 'grid-template-columns 0.3s',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />
        <div style={{
          position: 'absolute', top: 20, left: 24,
          fontFamily: 'var(--font-serif)',
          fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}>
          Penteract · 5-Cube · 32 vertices in 5D
        </div>
        {score.attempted > 0 && (
          <div style={{
            position: 'absolute', top: 20, right: 80,
            fontSize: 12, color: 'rgba(255,255,255,0.6)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {score.correct} / {score.attempted}
          </div>
        )}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          {panelOpen ? '→ hide' : '← tools'}
        </button>
        <div style={{
          position: 'absolute', bottom: 20, left: 24, right: 24,
          fontSize: 11, color: 'rgba(255,255,255,0.35)',
          textAlign: 'center',
        }}>
          click a corner to mark it · warm colors = farther in w and v · cool = closer
        </div>
      </div>

      {panelOpen && (
        <div style={{
          background: 'var(--bg-panel)',
          borderLeft: '1px solid var(--border-subtle)',
          padding: '28px 24px',
          overflowY: 'auto',
          fontSize: 12,
        }}>
          <div style={sectionLabel}>Rotation planes</div>
          <RotationControls
            planes={PLANES}
            angles={s.angles}
            spin={s.spin}
            onAngleChange={onAngleChange}
            onSpinChange={onSpinChange}
            threeDimensionalCount={3}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 24 }}>
            <button onClick={resetView}>reset view</button>
            <button onClick={clearMarks}>clear marks</button>
          </div>

          <div style={sectionLabel}>Tesseract cells (10 total)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {cells.map((c, i) => (
              <button
                key={i}
                onClick={() => toggleCell(i)}
                style={{
                  padding: '4px 8px',
                  fontSize: 10,
                  background: s.activeCell === i ? 'var(--accent-4d)' : 'rgba(255,255,255,0.06)',
                  color: s.activeCell === i ? '#000' : 'var(--text-primary)',
                  borderColor: s.activeCell === i ? 'var(--accent-4d)' : 'var(--border-line)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div style={sectionLabel}>Puzzle</div>
          <PuzzlePanel
            puzzles={penteractPuzzles}
            onScoreChange={(correct, attempted) => setScore({ correct, attempted })}
          />

          <div style={{
            marginTop: 32,
            fontSize: 10,
            color: 'var(--text-faint)',
            lineHeight: 1.5,
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 16,
          }}>
            3D has 3 rotation planes. 5D has 10. The gold sliders rotate through w and v — the shape
            folds through itself while marked corners stay fixed.
          </div>
        </div>
      )}
    </div>
  );
}

const sectionLabel = {
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 14,
};
