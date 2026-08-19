const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export function TftKeyboard({ onKey, onEnter, onDismiss }) {
  return (
    <div className="setup-keyboard" aria-label="On-screen keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <div className={`setup-keyboard-row row-${rowIndex + 1}`} key={row.join('')}>
          {rowIndex === 2 ? <button className="key-wide" aria-label="Shift">⇧</button> : null}
          {row.map((key) => <button key={key} onClick={() => onKey(key)}>{key}</button>)}
          {rowIndex === 2 ? <button className="key-wide" aria-label="Delete" onClick={() => onKey('backspace')}>⌫</button> : null}
        </div>
      ))}
      <div className="setup-keyboard-row row-4">
        <button className="key-wide">.?123</button>
        <button onClick={() => onKey(',')}>,</button>
        <button className="key-space" aria-label="Space" onClick={() => onKey(' ')} />
        <button onClick={() => onKey('.')}>.</button>
        <button className="key-wide" aria-label="Hide keyboard" onClick={onDismiss}>⌨</button>
        <button className="key-enter" aria-label="Enter" onClick={onEnter}>↵</button>
      </div>
    </div>
  );
}
