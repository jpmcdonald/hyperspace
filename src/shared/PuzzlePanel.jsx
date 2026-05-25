import React, { useState } from 'react';

/**
 * Generic puzzle panel. Picks a random puzzle from the array, shows
 * tappable options, reveals an explanation after answering.
 *
 * Props:
 *   puzzles: [{ id, prompt, options: [...], answer, reveal }]
 *   onScoreChange(correct, attempted)  optional
 */
export default function PuzzlePanel({ puzzles, onScoreChange }) {
  const [current, setCurrent] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const newPuzzle = () => {
    const unused = puzzles.filter(p => !current || p.id !== current.id);
    const next = unused[Math.floor(Math.random() * unused.length)];
    setCurrent(next);
    setSelected(null);
    setAnswered(false);
  };

  const submit = (opt) => {
    setSelected(opt);
    setAnswered(true);
    const next = {
      correct: score.correct + (opt === current.answer ? 1 : 0),
      attempted: score.attempted + 1,
    };
    setScore(next);
    onScoreChange?.(next.correct, next.attempted);
  };

  if (!current) {
    return (
      <button onClick={newPuzzle} style={{ width: '100%', padding: 10 }}>
        give me a question
      </button>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: 14,
      borderRadius: 2,
    }}>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 14,
        lineHeight: 1.4,
        marginBottom: 12,
      }}>
        {current.prompt}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {current.options.map(opt => {
          const isSel = selected === opt;
          const isCorr = opt === current.answer;
          let bg = 'rgba(255,255,255,0.06)', color = 'var(--text-primary)', border = 'var(--border-line)';
          if (answered && isSel) {
            if (isCorr) { bg = 'var(--accent-correct)'; color = '#000'; border = 'var(--accent-correct)'; }
            else { bg = 'var(--accent-wrong)'; color = '#000'; border = 'var(--accent-wrong)'; }
          } else if (answered && isCorr) {
            bg = 'rgba(127,209,122,0.3)'; border = 'var(--accent-correct)';
          }
          return (
            <button
              key={opt}
              onClick={() => !answered && submit(opt)}
              disabled={answered}
              style={{ background: bg, color, borderColor: border, minWidth: 44 }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{
          marginTop: 12,
          fontSize: 11,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.75)',
          fontStyle: 'italic',
        }}>
          {current.reveal}
        </div>
      )}
      <button onClick={newPuzzle} style={{ width: '100%', marginTop: 12, padding: 8 }}>
        {answered ? 'next question →' : 'skip'}
      </button>
    </div>
  );
}
