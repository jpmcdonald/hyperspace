import React, { useState } from 'react';
import Tesseract from './modules/Tesseract/Tesseract.jsx';
import Penteract from './modules/Penteract/Penteract.jsx';
import PhaseSpace from './modules/PhaseSpace/PhaseSpace.jsx';

// To add a module: build the component, then add an entry here.
const modules = [
  {
    id: 'tesseract',
    name: 'Tesseract',
    subtitle: '4-cube · 16 vertices · 8 cubic cells',
    dimension: 4,
    status: 'ready',
    component: Tesseract,
    description: 'Six rotation planes. Three are normal 3D spin; three move the shape through the 4th dimension. Mark vertices, isolate any of the 8 cubic cells, work the puzzles.',
  },
  {
    id: 'penteract',
    name: 'Penteract',
    subtitle: '5-cube · 32 vertices · 10 rotation planes',
    dimension: 5,
    status: 'ready',
    component: Penteract,
    description: 'Ten rotation planes — seven move the shape through w and v. Mark vertices, isolate any of the 10 tesseract-cells, work the counting puzzles.',
  },
  {
    id: 'phase',
    name: 'Pendulum Phase Space',
    subtitle: 'Position × velocity · 2D state space',
    dimension: 2,
    status: 'ready',
    component: PhaseSpace,
    description: 'Set (θ, ω), press play, watch the orbit. Toggle damping, compare linear vs nonlinear, read energy — AP Physics as geometry.',
  },
  {
    id: 'iris',
    name: 'Iris Projection',
    subtitle: '4D data point cloud · projection rotation',
    dimension: 4,
    status: 'coming',
    description: 'Classic data: 150 flowers, 4 measurements each. Rotate the projection and watch the three species cluster, then merge, then re-cluster. PCA as a feeling.',
  },
];

export default function App() {
  const [activeId, setActiveId] = useState(null);

  if (activeId) {
    const mod = modules.find(m => m.id === activeId);
    const ModComponent = mod.component;
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 12,
        }}>
          <button onClick={() => setActiveId(null)}>← all modules</button>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--text-muted)',
          }}>
            {mod.name}
          </span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ModComponent />
        </div>
      </div>
    );
  }

  return <ModulePicker modules={modules} onSelect={setActiveId} />;
}

function ModulePicker({ modules, onSelect }) {
  return (
    <div style={{
      height: '100vh',
      overflow: 'auto',
      padding: '60px 48px',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <header style={{ marginBottom: 56 }}>
        <div style={{
          fontSize: 11,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 12,
        }}>
          Hyperspace · v0.1
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 48,
          margin: 0,
          marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          shapes that don't fit in 3D
        </h1>
        <p style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.6)',
          maxWidth: 640,
          margin: 0,
        }}>
          3D is the budget. Everything above 3D has to be expressed through projection,
          motion, color, and interaction. Pick a module and start.
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {modules.map(mod => (
          <ModuleCard
            key={mod.id}
            mod={mod}
            onClick={() => mod.status === 'ready' && onSelect(mod.id)}
          />
        ))}
      </div>

      <footer style={{
        marginTop: 80,
        paddingTop: 24,
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 11,
        color: 'var(--text-faint)',
        lineHeight: 1.6,
      }}>
        Each module is self-contained. Source lives in <code style={{ color: 'var(--accent-3d)' }}>src/modules/</code>.
        Shared n-D infrastructure (projection, rotation controls, puzzle UI) lives in <code style={{ color: 'var(--accent-3d)' }}>src/shared/</code>.
        See <code style={{ color: 'var(--accent-3d)' }}>README.md</code> for adding new modules.
      </footer>
    </div>
  );
}

function ModuleCard({ mod, onClick }) {
  const ready = mod.status === 'ready';
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 3,
        padding: '24px 22px',
        cursor: ready ? 'pointer' : 'default',
        opacity: ready ? 1 : 0.45,
        transition: 'all 0.2s',
        position: 'relative',
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        if (ready) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.borderColor = 'var(--accent-3d)';
        }
      }}
      onMouseLeave={(e) => {
        if (ready) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 22,
          color: 'var(--text-primary)',
        }}>
          {mod.name}
        </span>
        <span style={{
          fontSize: 10,
          color: 'var(--accent-4d)',
          letterSpacing: '0.1em',
        }}>
          {mod.dimension}D
        </span>
      </div>

      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        marginBottom: 16,
        letterSpacing: '0.04em',
      }}>
        {mod.subtitle}
      </div>

      <div style={{
        fontSize: 12,
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.55)',
        flex: 1,
      }}>
        {mod.description}
      </div>

      <div style={{
        marginTop: 16,
        fontSize: 10,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: ready ? 'var(--accent-3d)' : 'var(--text-faint)',
      }}>
        {ready ? 'open →' : 'coming next'}
      </div>
    </div>
  );
}
