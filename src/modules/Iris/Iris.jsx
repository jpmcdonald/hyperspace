import React, { useState, useRef, useEffect } from 'react';
import { rotationPlanes, projectVertices } from '../../shared/ProjectionEngine.js';
import RotationControls from '../../shared/RotationControls.jsx';
import PuzzlePanel from '../../shared/PuzzlePanel.jsx';
import { irisPoints, SPECIES_LIST, FEATURE_NAMES } from './irisData.js';
import { colorForSpecies, displayName } from './colors.js';
import { irisPuzzles } from './puzzles.js';

const N = 4;
const PLANES = rotationPlanes(N);
const INITIAL_ANGLES = Object.fromEntries(PLANES.map(p => [p.label, 0]));
const INITIAL_SPIN = Object.fromEntries(PLANES.map(p => [p.label, p.label === 'xw']));

const vertices = irisPoints.map(p => p.point);

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Iris() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    angles: { ...INITIAL_ANGLES },
    spin: { ...INITIAL_SPIN },
    highlightedSpecies: null,
  });

  const [, setTick] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

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
    const W = rect.width;
    const H = rect.height;
    const scale = Math.min(W, H) * 0.18;
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

    const projected = projectVertices(vertices, s.angles, PLANES, {
      defaultDist: 3,
      zDist: 4,
      scale,
      cx: W / 2,
      cy: H / 2,
    });

    for (let i = 0; i < irisPoints.length; i++) {
      const { species } = irisPoints[i];
      const p = projected[i];
      const color = colorForSpecies(species);
      const highlighted = s.highlightedSpecies === null || s.highlightedSpecies === species;
      const alpha = highlighted ? 0.75 : 0.12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, alpha);
      ctx.fill();
    }
  }

  const resetView = () => {
    const s = stateRef.current;
    for (const plane of PLANES) s.angles[plane.label] = 0;
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

  const toggleSpecies = (species) => {
    const s = stateRef.current;
    s.highlightedSpecies = s.highlightedSpecies === species ? null : species;
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
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'default' }}
        />
        <div style={{
          position: 'absolute', top: 20, left: 24,
          fontFamily: 'var(--font-serif)',
          fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}>
          Iris · 4D Point Cloud · 150 flowers
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
          rotate to change the 2D shadow · gold planes mix in the 4th measurement
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
          </div>

          <div style={sectionLabel}>Species</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {SPECIES_LIST.map(species => {
              const active = s.highlightedSpecies === species;
              const color = colorForSpecies(species);
              return (
                <button
                  key={species}
                  onClick={() => toggleSpecies(species)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 10px',
                    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                    borderColor: active ? color : 'var(--border-line)',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                  }} />
                  <span>{displayName(species)}</span>
                </button>
              );
            })}
          </div>

          <div style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: 20,
          }}>
            x = {FEATURE_NAMES[0]} · y = {FEATURE_NAMES[1]} · z = {FEATURE_NAMES[2]} · w = {FEATURE_NAMES[3]}
          </div>

          <div style={sectionLabel}>Puzzle</div>
          <PuzzlePanel
            puzzles={irisPuzzles}
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
            Each flower is a point in 4D. The scatter plot is a 2D shadow. Rotating the projection
            is choosing a different shadow of the same data — clusters appear and disappear.
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
