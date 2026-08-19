import { Icon } from './Icon';

export function GlobalInfo({ time = '12:30', connected = true }) {
  return (
    <div className="global-info" aria-label={`Wi-Fi ${connected ? 'connected' : 'disconnected'}, ${time}`}>
      <Icon name="wifi" size={25} />
      <span>{time}</span>
    </div>
  );
}

export function TopBar({ title, back = true, trailing = null, onBack }) {
  return (
    <div className="top-bar">
      <div className="top-bar__start">
        {back ? <button className="icon-button" aria-label="Back" onClick={onBack}><Icon name="back" size={30} /></button> : null}
        <h1>{title}</h1>
      </div>
      <div className="top-bar__end">{trailing}</div>
    </div>
  );
}

export function Button({ children, variant = 'primary', icon, disabled = false, visualState = '', className = '', ...props }) {
  return (
    <button className={`button button--${variant} ${visualState ? `is-${visualState}` : ''} ${className}`} disabled={disabled} {...props}>
      {icon ? <Icon name={icon} size={22} /> : null}
      <span>{children}</span>
    </button>
  );
}

export function IconButton({ icon, label, selected = false }) {
  return (
    <button className={`icon-tile ${selected ? 'is-selected' : ''}`} aria-label={label}>
      <Icon name={icon} size={30} />
      <span>{label}</span>
    </button>
  );
}

export function Surface({ children, className = '' }) {
  return <section className={`surface ${className}`}>{children}</section>;
}

export function ParameterCard({ icon, label, value, active = false, disabled = false, error = false, wide = false }) {
  return (
    <button className={`parameter-card ${active ? 'is-active' : ''} ${error ? 'is-error' : ''} ${wide ? 'is-wide' : ''}`} disabled={disabled}>
      <span className="parameter-card__label"><Icon name={icon} size={19} />{label}</span>
      <strong>{value}</strong>
      <Icon name="chevron" size={18} className="parameter-card__chevron" />
    </button>
  );
}

export function PhysicalKeyHint({ action = 'start', disabled = false, onClick, compact = false }) {
  const copy = action === 'resume' ? 'Press the physical Start / Pause key to resume' : 'Press the physical Start / Pause key to start';
  const Element = onClick ? 'button' : 'div';
  return (
    <Element className={`physical-key-hint ${compact ? 'physical-key-hint--compact' : ''} ${disabled ? 'is-disabled' : ''} ${onClick ? 'is-interactive' : ''}`} onClick={onClick} disabled={onClick ? disabled : undefined}>
      {compact ? <><span className="physical-key-hint__prefix">Press</span><span className="physical-key-hint__key"><Icon name={action === 'resume' ? 'play' : 'play'} size={17} /></span><span className="physical-key-hint__suffix">to start.</span></> : <><span className="physical-key-hint__key"><Icon name={action === 'resume' ? 'play' : 'play'} size={17} /></span><span>{copy}</span></>}
    </Element>
  );
}

export function Notice({ tone = 'info', title, children, closable = false }) {
  return (
    <div className={`notice notice--${tone}`}>
      <Icon name={tone === 'warning' ? 'info' : 'sparkle'} size={22} />
      <div><strong>{title}</strong>{children ? <p>{children}</p> : null}</div>
      {closable ? <button className="notice__close" aria-label="Close"><Icon name="close" size={19} /></button> : null}
    </div>
  );
}

export function Segmented({ items, selected }) {
  return (
    <div className="segmented">
      {items.map((item) => <button key={item} className={item === selected ? 'is-selected' : ''}>{item}</button>)}
    </div>
  );
}

export function ListItem({ label, value, icon, selected = false, disabled = false }) {
  return (
    <button className={`list-item ${selected ? 'is-selected' : ''}`} disabled={disabled}>
      <span className="list-item__label">{icon ? <Icon name={icon} size={22} /> : null}<span>{label}</span></span>
      <span className="list-item__value">{value ? <strong>{value}</strong> : null}<Icon name="chevron" size={18} /></span>
    </button>
  );
}

export function ProgressRing({ value = 68, label = 'Heating' }) {
  return (
    <div className="progress-ring" style={{ '--progress': `${value * 3.6}deg` }}>
      <div><strong>{value}%</strong><span>{label}</span></div>
    </div>
  );
}
