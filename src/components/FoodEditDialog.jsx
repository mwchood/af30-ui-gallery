import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { TftKeyboard } from './TftKeyboard';

export const foodCategories = [
  { id: 'chicken', title: 'Chicken', subtypes: ['Whole chicken', 'Wings', 'Breast', 'Thighs', 'Boneless bites'] },
  { id: 'beef', title: 'Beef', subtypes: ['Steak', 'Beef cubes', 'Burger patties', 'Meatballs'] },
  { id: 'pork', title: 'Pork', subtypes: ['Pork chops', 'Pork belly', 'Ribs', 'Sausages', 'Bacon'] },
  { id: 'lamb', title: 'Lamb', subtypes: ['Lamb chops', 'Rack of lamb', 'Lamb cubes'] },
  { id: 'fish', title: 'Fish', subtypes: ['Salmon fillet', 'White fish fillet', 'Whole fish', 'Fish sticks'] },
  { id: 'seafood', title: 'Seafood', subtypes: ['Shrimp', 'Scallops', 'Calamari', 'Crab cakes'] },
  { id: 'potatoes', title: 'Potatoes', subtypes: ['Baby potatoes', 'French fries', 'Potato wedges', 'Hash browns'] },
  { id: 'vegetables', title: 'Vegetables', subtypes: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Mixed vegetables'] },
  { id: 'pumpkin', title: 'Pumpkin', subtypes: ['Kabocha wedges', 'Pumpkin cubes', 'Butternut squash'] },
  { id: 'frozen-snacks', title: 'Frozen snacks', subtypes: ['Chicken nuggets', 'Mozzarella sticks', 'Spring rolls', 'Onion rings'] },
  { id: 'bakery', title: 'Bakery', subtypes: ['Toast', 'Bread rolls', 'Pastries', 'Cookies'] },
  { id: 'eggs', title: 'Eggs', subtypes: ['Baked eggs', 'Egg bites', 'Scotch eggs'] },
  { id: 'tofu', title: 'Tofu', subtypes: ['Firm tofu cubes', 'Tofu steaks', 'Stuffed tofu'] },
  { id: 'nuts', title: 'Nuts & seeds', subtypes: ['Mixed nuts', 'Almonds', 'Pumpkin seeds'] },
];

const amountPresets = [250, 500, 750, 1000];

// Amount is intentionally a range: the camera cannot reliably determine an exact food weight.
export function formatAmountRange(lowerBound) {
  const lower = Math.min(1500, Math.max(50, Number.parseInt(lowerBound, 10) || 500));
  return `${lower}–${Math.min(1800, lower + 300)} g`;
}

export function getFoodCategory(id) {
  return foodCategories.find((category) => category.id === id) ?? foodCategories[6];
}

export function FoodEditDialog({ type, categoryId = 'potatoes', value, onApply, onClose }) {
  const category = getFoodCategory(categoryId);
  const [query, setQuery] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [amount, setAmount] = useState(() => Math.min(1500, Math.max(50, Number.parseInt(value, 10) || 500)));
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(() => foodCategories.filter((item) => {
    if (!normalizedQuery) return true;
    return item.title.toLowerCase().includes(normalizedQuery)
      || item.subtypes.some((subtype) => subtype.toLowerCase().includes(normalizedQuery));
  }), [normalizedQuery]);
  const typeSearchKey = (key) => setQuery((current) => key === 'backspace' ? current.slice(0, -1) : `${current}${key}`.slice(0, 32));
  const dismissKeyboardOnOutsidePointer = (event) => {
    if (!keyboardOpen || event.target.closest?.('.food-edit-search, .setup-keyboard')) return;
    setKeyboardOpen(false);
  };

  const titles = {
    category: ['Select food', 'Choose the food category that best matches what is in the basket.'],
    subtype: [`Select ${category.title} type`, 'Choose the closest food type.'],
    amount: ['Edit amount', 'Set the food weight range.'],
    frozen: ['Is the food frozen?', 'This adjusts the recommended cooking time.'],
  };
  const [title, description] = titles[type] ?? titles.category;

  return (
    <div className={`food-edit-overlay ${keyboardOpen ? 'has-keyboard' : ''}`} role="presentation" onPointerDownCapture={dismissKeyboardOnOutsidePointer}>
      <section className={`food-edit-dialog food-edit-dialog--${type}`} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <div><h2>{title}</h2><p>{description}</p></div>
          <button aria-label="Close" onClick={onClose}><Icon name="close" size={27} /></button>
        </header>

        {type === 'category' ? (
          <>
            <label className="food-edit-search">
              <Icon name="search" size={25} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClick={() => setKeyboardOpen(true)}
                placeholder="Search food"
              />
              {query ? <button aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={20} /></button> : null}
            </label>
            <div className="food-category-grid">
              {filteredCategories.map((item) => (
                <button key={item.id} onClick={() => onApply?.({ categoryId: item.id, category: item.title, subtype: item.subtypes[0] })}>
                  <strong>{item.title}</strong><small>{item.subtypes.slice(0, 2).join(' · ')}</small><Icon name="chevron" size={20} />
                </button>
              ))}
              {!filteredCategories.length ? <div className="food-edit-empty">No matching food</div> : null}
            </div>
          </>
        ) : null}

        {type === 'subtype' ? (
          <div className="food-subtype-grid">
            {category.subtypes.map((subtype) => <button className={value === subtype ? 'is-selected' : ''} key={subtype} onClick={() => onApply?.(subtype)}><span>{subtype}</span>{value === subtype ? <Icon name="correct" size={22} /> : null}</button>)}
          </div>
        ) : null}

        {type === 'amount' ? (
          <div className="food-amount-editor">
            <div className="food-amount-stepper">
              <button aria-label="Decrease amount" onClick={() => setAmount((current) => Math.max(50, current - 50))}>−</button>
              <strong>{formatAmountRange(amount)}</strong>
              <button aria-label="Increase amount" onClick={() => setAmount((current) => Math.min(1500, current + 50))}>+</button>
            </div>
            <div className="food-amount-presets">{amountPresets.map((preset) => <button className={amount === preset ? 'is-selected' : ''} key={preset} onClick={() => setAmount(preset)}>{formatAmountRange(preset)}</button>)}</div>
            <button className="food-edit-primary" onClick={() => onApply?.(formatAmountRange(amount))}>Done</button>
          </div>
        ) : null}

        {type === 'frozen' ? (
          <div className="food-frozen-options">
            {['No', 'Yes'].map((option) => <button className={value === option ? 'is-selected' : ''} key={option} onClick={() => onApply?.(option)}><strong>{option}</strong><span>{option === 'No' ? 'Fresh or thawed' : 'Cook directly from frozen'}</span>{value === option ? <Icon name="correct" size={25} /> : null}</button>)}
          </div>
        ) : null}
      </section>
      {type === 'category' && keyboardOpen ? <TftKeyboard onKey={typeSearchKey} onEnter={() => setKeyboardOpen(false)} onDismiss={() => setKeyboardOpen(false)} /> : null}
    </div>
  );
}
