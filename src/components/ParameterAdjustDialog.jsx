import { useState } from 'react';
import { Button } from './Primitives';
import { Icon } from './Icon';

const defaultModes = ['Steak', 'Bacon', 'Roast', 'Bake', 'Air Fry', 'Toast', 'Grill', 'Reheat'];

const fieldDefaults = {
  mode: { label: 'Mode', options: defaultModes, format: (value) => value },
  temperature: { label: 'Temp', min: 60, max: 230, step: 5, format: (value) => `${value}°C` },
  time: { label: 'Time', min: 1, max: 60, step: 1, format: (value) => `${value} min` },
  fan: { label: 'Fan', min: 1, max: 5, step: 1, format: (value) => `Level ${value}` },
};

export function ParameterAdjustDialog({
  title = 'Adjust settings',
  fields = ['mode', 'temperature', 'fan'],
  values,
  initialField,
  onChange,
  onClose,
}) {
  const availableFields = fields.map((field) => ({ id: field, ...fieldDefaults[field] })).filter((field) => field.label);
  const [activeField, setActiveField] = useState(initialField && fields.includes(initialField) ? initialField : fields[0]);
  const current = availableFields.find((field) => field.id === activeField) ?? availableFields[0];
  const value = values[current.id];

  const move = (direction) => {
    if (current.options) {
      const currentIndex = Math.max(0, current.options.indexOf(value));
      const nextIndex = (currentIndex + direction + current.options.length) % current.options.length;
      onChange(current.id, current.options[nextIndex]);
      return;
    }
    const nextValue = Math.min(current.max, Math.max(current.min, value + current.step * direction));
    onChange(current.id, nextValue);
  };

  return (
    <div className="overlay parameter-adjust-overlay" role="presentation">
      <section className={`parameter-adjust-dialog ${availableFields.length === 1 ? 'is-single' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <div><h2>{title}</h2><p>{availableFields.length === 1 ? (current.id === 'time' ? 'Set the cooking time.' : 'Choose a cooking mode.') : 'Choose a parameter, then adjust its value.'}</p></div>
          <button aria-label="Close" onClick={onClose}><Icon name="close" size={24} /></button>
        </header>
        {availableFields.length > 1 ? (
          <nav className={`parameter-adjust-tabs tabs-${availableFields.length}`} aria-label="Cooking parameters">
            {availableFields.map((field) => <button key={field.id} className={field.id === current.id ? 'is-selected' : ''} onClick={() => setActiveField(field.id)}>{field.label}</button>)}
          </nav>
        ) : null}
        <div className="parameter-adjust-control">
          <small>{current.label}</small>
          <div>
            <button className="is-previous" aria-label={`Previous ${current.label}`} onClick={() => move(-1)}><Icon name="chevron" size={29} /></button>
            <strong>{current.format(value)}</strong>
            <button aria-label={`Next ${current.label}`} onClick={() => move(1)}><Icon name="chevron" size={29} /></button>
          </div>
        </div>
        <Button onClick={onClose}>Done</Button>
      </section>
    </div>
  );
}
