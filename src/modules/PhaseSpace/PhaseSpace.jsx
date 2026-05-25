import React, { useState, useRef, useEffect } from 'react';
import PuzzlePanel from '../../shared/PuzzlePanel.jsx';
import {
  DEFAULT_PARAMS,
  DEFAULT_STATE,
  INTEGRATION_DT,
  stepRK4,
  energy,
} from './dynamics.js';
import { phaseSpacePuzzles } from './puzzles.js';

const HISTORY_CAP = 8000;
const MAX_SUBSTEPS = 5;
const MARGIN = 48;

function computeBounds(s) {
  const { state, history, params } = s;
  const omegaLimit = 2 * Math.sqrt(params.g / params.L);
  let thetaMin = -Math.PI;
  let thetaMax = Math.PI;
  let omegaMin = -omegaLimit;
  let omegaMax = omegaLimit;

  const points = history.length ? [...history, state] : [state];
  for (const p of points) {
    thetaMin = Math.min(thetaMin, p.theta);
    thetaMax = Math.max(thetaMax, p.theta);
    omegaMin = Math.min(omegaMin, p.omega);
    omegaMax = Math.max(omegaMax, p.omega);
  }

  const padTheta = Math.max(0.25, (thetaMax - thetaMin) * 0.1);
  const padOmega = Math.max(0.25, (omegaMax - omegaMin) * 0.1);
  return {
    thetaMin: thetaMin - padTheta,
    thetaMax: thetaMax + padTheta,
    omegaMin: omegaMin - padOmega,
    omegaMax: omegaMax + padOmega,
  };
}

function worldToScreen(theta, omega, bounds, W, H) {
  const plotW = W - 2 * MARGIN;
  const plotH = H - 2 * MARGIN;
  const x = MARGIN + ((theta - bounds.thetaMin) / (bounds.thetaMax - bounds.thetaMin)) * plotW;
  const y = MARGIN + ((bounds.omegaMax - omega) / (bounds.omegaMax - bounds.omegaMin)) * plotH;
  return { x, y };
}

function screenToWorld(sx, sy, bounds, W, H) {
  const plotW = W - 2 * MARGIN;
  const plotH = H - 2 * MARGIN;
  const theta = bounds.thetaMin + ((sx - MARGIN) / plotW) * (bounds.thetaMax - bounds.thetaMin);
  const omega = bounds.omegaMax - ((sy - MARGIN) / plotH) * (bounds.omegaMax - bounds.omegaMin);
  return { theta, omega };
}

export default function PhaseSpace() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    state: { ...DEFAULT_STATE },
    history: [],
    playing: false,
    params: { ...DEFAULT_PARAMS },
    bounds: null,
    initialEnergy: null,
    dragging: false,
  });

  const [, setTick] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const [displayEnergy, setDisplayEnergy] = useState(energy(DEFAULT_STATE, DEFAULT_PARAMS));

  useEffect(() => {
    let last = performance.now();
    let accumulator = 0;
    const step = (now) => {
      const elapsed = (now - last) / 1000;
      last = now;
      const s = stateRef.current;

      if (s.playing) {
        accumulator += elapsed;
        accumulator = Math.min(accumulator, MAX_SUBSTEPS * INTEGRATION_DT);
        let steps = 0;
        while (accumulator >= INTEGRATION_DT && steps < MAX_SUBSTEPS) {
          s.state = stepRK4(s.state, INTEGRATION_DT, s.params);
          s.history.push({ ...s.state });
          if (s.history.length > HISTORY_CAP) s.history.shift();
          accumulator -= INTEGRATION_DT;
          steps++;
        }
      } else {
        accumulator = 0;
      }

      drawFrame();
      setDisplayEnergy(energy(s.state, s.params));
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
    const s = stateRef.current;
    const bounds = computeBounds(s);
    s.bounds = bounds;

    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    const gridSteps = 8;
    for (let i = 0; i <= gridSteps; i++) {
      const theta = bounds.thetaMin + (i / gridSteps) * (bounds.thetaMax - bounds.thetaMin);
      const { x } = worldToScreen(theta, 0, bounds, W, H);
      ctx.beginPath();
      ctx.moveTo(x, MARGIN);
      ctx.lineTo(x, H - MARGIN);
      ctx.stroke();
    }
    for (let j = 0; j <= gridSteps; j++) {
      const omega = bounds.omegaMin + (j / gridSteps) * (bounds.omegaMax - bounds.omegaMin);
      const { y } = worldToScreen(0, omega, bounds, W, H);
      ctx.beginPath();
      ctx.moveTo(MARGIN, y);
      ctx.lineTo(W - MARGIN, y);
      ctx.stroke();
    }

    // Axes through origin
    if (bounds.thetaMin <= 0 && bounds.thetaMax >= 0) {
      const zeroX = worldToScreen(0, 0, bounds, W, H).x;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(zeroX, MARGIN);
      ctx.lineTo(zeroX, H - MARGIN);
      ctx.stroke();
    }
    if (bounds.omegaMin <= 0 && bounds.omegaMax >= 0) {
      const zeroY = worldToScreen(0, 0, bounds, W, H).y;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(MARGIN, zeroY);
      ctx.lineTo(W - MARGIN, zeroY);
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.fillText('θ', W - MARGIN + 6, H - MARGIN + 4);
    ctx.fillText('ω', MARGIN - 4, MARGIN - 8);

    // Trajectory
    if (s.history.length > 1) {
      ctx.strokeStyle = 'rgba(143, 191, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const first = worldToScreen(s.history[0].theta, s.history[0].omega, bounds, W, H);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < s.history.length; i++) {
        const p = worldToScreen(s.history[i].theta, s.history[i].omega, bounds, W, H);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Initial condition marker
    const ic = s.history.length ? s.history[0] : s.state;
    const icScreen = worldToScreen(ic.theta, ic.omega, bounds, W, H);
    ctx.beginPath();
    ctx.arc(icScreen.x, icScreen.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();

    // Current state head
    const head = worldToScreen(s.state.theta, s.state.omega, bounds, W, H);
    ctx.beginPath();
    ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#8fbfff';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawPendulumInset(ctx, W, s.state.theta, s.params.L);
  }

  function drawPendulumInset(ctx, W, theta, L) {
    const size = 120;
    const insetX = W - size - 24;
    const insetY = 68;
    const pivotX = insetX + size / 2;
    const pivotY = insetY + 18;
    const rodLen = 42 + L * 18;

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(insetX, insetY, size, size);

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '9px var(--font-mono, monospace)';
    ctx.fillText('pendulum', insetX + 8, insetY + 12);

    const bobX = pivotX + rodLen * Math.sin(theta);
    const bobY = pivotY + rodLen * Math.cos(theta);

    ctx.strokeStyle = 'rgba(143, 191, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bobX, bobY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#8fbfff';
    ctx.fill();
  }

  const setInitialCondition = (theta, omega, fromDrag = false) => {
    const s = stateRef.current;
    s.state = { theta, omega };
    s.history = [];
    s.playing = false;
    s.initialEnergy = null;
    if (!fromDrag) s.dragging = false;
    setTick(t => t + 1);
  };

  const canvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleCanvasMouseDown = (e) => {
    const s = stateRef.current;
    if (!s.bounds) return;
    const { x, y } = canvasCoords(e);
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(x, y, s.bounds, rect.width, rect.height);
    s.dragging = true;
    setInitialCondition(world.theta, world.omega, true);
  };

  const handleCanvasMouseMove = (e) => {
    const s = stateRef.current;
    if (!s.dragging || !s.bounds) return;
    const { x, y } = canvasCoords(e);
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(x, y, s.bounds, rect.width, rect.height);
    setInitialCondition(world.theta, world.omega, true);
  };

  const handleCanvasMouseUp = () => {
    stateRef.current.dragging = false;
  };

  const togglePlay = () => {
    const s = stateRef.current;
    if (!s.playing && s.history.length === 0) {
      s.initialEnergy = energy(s.state, s.params);
      s.history.push({ ...s.state });
    }
    s.playing = !s.playing;
    setTick(t => t + 1);
  };

  const resetTrajectory = () => {
    const s = stateRef.current;
    s.history = [];
    s.playing = false;
    s.initialEnergy = null;
    setTick(t => t + 1);
  };

  // Pause integration when params change — keeps the portrait stable while tuning.
  const updateParam = (key, value) => {
    stateRef.current.params[key] = value;
    stateRef.current.playing = false;
    setTick(t => t + 1);
  };

  const toggleLinearized = (checked) => {
    stateRef.current.params.linearized = checked;
    stateRef.current.playing = false;
    setTick(t => t + 1);
  };

  const s = stateRef.current;
  const E = displayEnergy;
  const deltaE = s.initialEnergy !== null && s.params.b === 0
    ? E - s.initialEnergy
    : null;

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
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />
        <div style={{
          position: 'absolute', top: 20, left: 24,
          fontFamily: 'var(--font-serif)',
          fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}>
          Pendulum · Phase Space · (θ, ω)
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
          click or drag to set initial condition · play to trace the orbit
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
          <div style={sectionLabel}>Simulation</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button onClick={togglePlay}>
              {s.playing ? 'pause' : 'play'}
            </button>
            <button onClick={resetTrajectory}>reset trajectory</button>
          </div>

          <div style={sectionLabel}>Parameters</div>
          <ParamSlider
            label="g"
            value={s.params.g}
            min={1}
            max={20}
            step={0.1}
            onChange={(v) => updateParam('g', v)}
          />
          <ParamSlider
            label="L"
            value={s.params.L}
            min={0.5}
            max={2}
            step={0.05}
            onChange={(v) => updateParam('L', v)}
          />
          <ParamSlider
            label="b"
            value={s.params.b}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => updateParam('b', v)}
          />
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            marginBottom: 20,
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={s.params.linearized}
              onChange={(e) => toggleLinearized(e.target.checked)}
              style={{ accentColor: 'var(--accent-4d)' }}
            />
            <span>linearized (sin θ ≈ θ)</span>
          </label>

          <div style={sectionLabel}>Energy</div>
          <div style={{
            fontVariantNumeric: 'tabular-nums',
            marginBottom: 8,
            color: 'var(--text-primary)',
          }}>
            E = {E.toFixed(3)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 20 }}>
            {s.params.b === 0
              ? 'energy (should be conserved)'
              : 'energy (dissipating)'}
            {deltaE !== null && (
              <span style={{ display: 'block', marginTop: 4 }}>
                ΔE = {deltaE >= 0 ? '+' : ''}{deltaE.toFixed(4)}
              </span>
            )}
          </div>

          <div style={sectionLabel}>State</div>
          <div style={{
            fontVariantNumeric: 'tabular-nums',
            fontSize: 11,
            color: 'var(--text-muted)',
            marginBottom: 20,
          }}>
            θ = {s.state.theta.toFixed(3)} · ω = {s.state.omega.toFixed(3)}
          </div>

          <div style={sectionLabel}>Puzzle</div>
          <PuzzlePanel
            puzzles={phaseSpacePuzzles}
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
            A pendulum needs two numbers: angle and angular velocity. Those two numbers are a point
            in a plane. The motion is a curve through that plane — an ellipse when undamped, a spiral
            when damped.
          </div>
        </div>
      )}
    </div>
  );
}

function ParamSlider({ label, value, min, max, step, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4,
        color: 'var(--text-muted)',
      }}>
        <span>{label}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ accentColor: 'var(--accent-3d)' }}
      />
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
