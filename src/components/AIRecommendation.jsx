import { useEffect, useState } from 'react';
import { assetPath } from '../assetPath';
import { Icon } from './Icon'; // AF30 recommendation copy follows the V2 readable layout.
import { FoodCandidate } from './AIPlanWorkspace';
import { Button } from './Primitives';

const manualFoods = [
  { id: 'chicken', title: 'Chicken', confidence: '76%', image: assetPath(''), subtype: 'Boneless bites' },
  { id: 'potatoes', title: 'Potatoes', confidence: '89%', image: assetPath(''), subtype: 'Baby potatoes' },
  { id: 'pumpkin', title: 'Pumpkin', confidence: '64%', image: assetPath(''), subtype: 'Kabocha wedges' },
];

const stateContent = {
  'MAN-AI-CS01': { icon: 'food', title: 'No food detected' },
  'MAN-AI-CS02': { icon: 'loader', title: 'Recognizing food…' },
  'MAN-AI-CS03': { icon: 'info', title: 'AI is unavailable' },
  'MAN-AI-CS04': { icon: 'retry', title: 'Food not recognized' },
  'MAN-AI-CS07': { icon: 'retry', title: 'Recommendation failed' },
};

function RecommendationHeader({ trailing }) {
  return <div className="ai-recommendation__heading"><span>Ingredients</span>{trailing}</div>;
}

function PreheatTip({ onPreheat }) {
  return (
    <div className="manual-preheat-tip">
      <div>
        <span><Icon name="info" size={20} />Tip</span>
        <p>For steak, toast and similar foods, preheating first can improve cooking results.</p>
      </div>
      <button onClick={onPreheat}>Go to Preheat <Icon name="chevron" size={17} /></button>
    </div>
  );
}

function FoodEditor({ selectedFood, foodDetails, onSelectFood, onEditDetail, onSelectOther, disabled = false }) {
  return (
    <div className={`manual-food-editor ${disabled ? 'is-disabled' : ''}`}>
      <div className="manual-food-candidates">
        {manualFoods.map((food) => (
          <FoodCandidate
            {...food}
            key={food.id}
            selected={food.id === selectedFood}
            onClick={() => !disabled && onSelectFood?.(food.id, food.subtype)}
          />
        ))}
        <button className="manual-other-food" disabled={disabled} onClick={onSelectOther}>
          <span>None match?</span>
          <strong>Choose another food.</strong>
        </button>
      </div>
      <div className="manual-food-fields">
        <button disabled={disabled} onClick={() => onEditDetail?.('subtype')}><span>Subtype</span><strong>{foodDetails.subtype}</strong><Icon name="edit" size={18} /></button>
        <button disabled={disabled} onClick={() => onEditDetail?.('amount')}><span>Amount</span><strong>{foodDetails.amount}</strong><Icon name="edit" size={18} /></button>
        <button disabled={disabled} onClick={() => onEditDetail?.('frozen')}><span>Frozen</span><strong>{foodDetails.frozen}</strong><Icon name="chevron" size={18} /></button>
      </div>
    </div>
  );
}

function ConfirmedFoodSummary({ selectedFood, foodDetails, onEdit }) {
  const food = manualFoods.find((item) => item.id === selectedFood);
  return (
    <div
      className="manual-confirmed-food"
      role="button"
      tabIndex={0}
      aria-label="Edit food details"
      onClick={onEdit}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onEdit?.();
        }
      }}
    >
      <div className="manual-confirmed-food__identity">
        {food?.image ? <img src={food.image} alt="" /> : null}
        <strong>{food?.title ?? foodDetails.category}</strong>
      </div>
      <div className="manual-confirmed-food__details">
        <span><small>Subtype</small><strong>{foodDetails.subtype}</strong></span>
        <span><small>Amount</small><strong>{foodDetails.amount}</strong></span>
        <span><small>Frozen</small><strong>{foodDetails.frozen === 'No' ? 'No Frozen' : 'Frozen'}</strong></span>
      </div>
    </div>
  );
}

export function AIRecommendation({
  state = 'MAN-AI-CS06',
  selectedFood = 'potatoes',
  foodDetails = { subtype: 'Baby potatoes', amount: '500–800 g', frozen: 'No' },
  recommendation = { mode: 'Air Fry', temperature: 190, time: 22, fan: 4 },
  onSelectFood,
  onSelectOther,
  onEditDetail,
  onApply,
  onRetry,
  onGenerate,
  onPreheat,
}) {
  const [foodConfirmed, setFoodConfirmed] = useState(false);
  useEffect(() => {
    if (!['MAN-AI-CS05', 'MAN-AI-CS06'].includes(state)) setFoodConfirmed(false);
  }, [state]);
  useEffect(() => {
    setFoodConfirmed(false);
  }, [selectedFood, foodDetails.subtype, foodDetails.amount, foodDetails.frozen]);

  if (state === 'MAN-AI-CS06') {
    if (!foodConfirmed) {
      return (
        <section className="ai-recommendation ai-recommendation--food-confirmation">
          <RecommendationHeader trailing={<button className="manual-retry-action" onClick={onRetry}><Icon name="retry" size={19} />Recognize again</button>} />
          <FoodEditor selectedFood={selectedFood} foodDetails={foodDetails} onSelectFood={onSelectFood} onEditDetail={onEditDetail} onSelectOther={onSelectOther} />
          <Button className="manual-confirm-food" onClick={() => { setFoodConfirmed(true); onGenerate?.(); }}>Confirm food details</Button>
        </section>
      );
    }
    return (
      <section className="ai-recommendation ai-recommendation--ready ai-recommendation--confirmed">
        <RecommendationHeader trailing={<button className="manual-edit-food" onClick={() => setFoodConfirmed(false)}><Icon name="edit" size={19} />Edit food</button>} />
        <ConfirmedFoodSummary selectedFood={selectedFood} foodDetails={foodDetails} onEdit={() => setFoodConfirmed(false)} />
        <div className="recommendation-title">Recommended settings</div>
        <div className="recommendation-values">
          <span><small>Mode</small><strong>{recommendation.mode}</strong></span>
          <span><small>Temp</small><strong>{recommendation.temperature}°C</strong></span>
          <span><small>Time</small><strong>{recommendation.time} min</strong></span>
          <span><small>Fan</small><strong>Level {recommendation.fan}</strong></span>
        </div>
        <Button className="manual-apply-recommendation" onClick={onApply}>Apply recommendation</Button>
      </section>
    );
  }

  if (state === 'MAN-AI-CS05') {
    return (
      <section className="ai-recommendation ai-recommendation--generating">
        <div className="manual-generation-status">
          <span className="manual-ai-state__icon is-loading"><Icon name="loader" size={44} /></span>
          <h3>Generating recommendation…</h3>
        </div>
      </section>
    );
  }

  const content = stateContent[state] ?? stateContent['MAN-AI-CS01'];
  const action = state === 'MAN-AI-CS04'
      ? <Button variant="ghost" icon="retry" onClick={onRetry}>Recognize again</Button>
      : state === 'MAN-AI-CS07'
        ? <Button variant="ghost" icon="retry" onClick={onGenerate}>Generate again</Button>
        : null;
  return (
    <section className={`ai-recommendation ai-recommendation--empty ${state === 'MAN-AI-CS03' ? 'is-unavailable' : ''}`}>
      <div className="manual-ai-state">
        <span className={`manual-ai-state__icon ${state === 'MAN-AI-CS02' ? 'is-loading' : ''}`}><Icon name={content.icon} size={46} /></span>
        <h3>{content.title}</h3>
      </div>
      {action ? <div className="manual-ai-state__action">{action}</div> : null}
      {state === 'MAN-AI-CS01' ? <PreheatTip onPreheat={onPreheat} /> : null}
    </section>
  );
}

