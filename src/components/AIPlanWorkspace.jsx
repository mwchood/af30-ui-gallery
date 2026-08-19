import { useEffect, useRef, useState } from 'react';
import { aiPlanStates } from '../data/screens';
import { assetPath } from '../assetPath';
import { Icon } from './Icon';
import { Button, PhysicalKeyHint } from './Primitives';
import { FoodEditDialog } from './FoodEditDialog';

const foodOptions = [
  { id: 'chicken', title: 'Chicken', confidence: '76%', image: assetPath(''), subtype: 'Boneless bites' },
  { id: 'potatoes', title: 'Potatoes', confidence: '89%', image: assetPath(''), subtype: 'Baby potatoes' },
  { id: 'pumpkin', title: 'Pumpkin', confidence: '64%', image: assetPath(''), subtype: 'Kabocha wedges' },
];

function RecognitionEmpty({ config, onNavigate }) {
  return (
    <div className="recognition-empty">
      <div className="recognition-empty__copy">
        <h2>{config.recognitionTitle}</h2>
      </div>
      <div className="preheat-tip">
        <div>
          <strong>Tip</strong>
          <span>For steak, toast and similar foods, preheating first can improve cooking results.</span>
        </div>
        <Button variant="ghost" onClick={() => onNavigate?.('preheat', 'PRE-P01')}>Go to Preheat</Button>
      </div>
    </div>
  );
}

function RecognitionLoading({ config }) {
  return (
    <div className="recognition-loading">
      <Icon name="loader" size={70} strokeWidth={1.8} className="recognition-spinner" />
      <h2>{config.recognitionTitle}</h2>
    </div>
  );
}

function AIExceptionState({ title, body, icon = 'close', primary, onPrimary, secondary, onSecondary, tone = 'error' }) {
  return (
    <div className={`ai-exception-state is-${tone}`}>
      <span className="ai-exception-state__icon"><Icon name={icon} size={48} /></span>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
      {primary || secondary ? <div className="ai-exception-state__actions">
        {primary ? <Button onClick={onPrimary}>{primary}</Button> : null}
        {secondary ? <Button variant="ghost" onClick={onSecondary}>{secondary}</Button> : null}
      </div> : null}
    </div>
  );
}

export function FoodCandidate({ title, confidence, image, selected = false, manual = false, onClick }) {
  return (
    <button className={`food-candidate ${selected ? 'is-selected' : ''} ${manual ? 'is-manual' : ''}`} onClick={onClick} aria-pressed={selected}>
      <span className="food-candidate__visual">
        {image ? <img src={image} alt="" /> : <Icon name="pointer" size={40} strokeWidth={1.8} />}
        {confidence ? <span className="food-candidate__confidence">{confidence}</span> : null}
      </span>
      <span className="food-candidate__meta"><strong>{title}</strong>{manual ? <small>Choose manually</small> : null}</span>
      {selected ? <span className="food-candidate__check"><Icon name="correct" size={19} /></span> : null}
    </button>
  );
}

function FoodConfirmation({ selectedFood, foodDetails, onSelectFood, onEdit }) {
  return (
    <div className="food-confirmation">
      <div className="food-candidates">
        {foodOptions.map((food) => <FoodCandidate {...food} key={food.id} selected={food.id === selectedFood} onClick={() => onSelectFood(food)} />)}
      </div>
      <button className="ai-other-food" type="button" onClick={() => onEdit('category')}>
        None of these? <strong>Select other food</strong>
      </button>
      <div className="food-field-label"><span>Food details</span></div>
      <div className="food-fields">
        <button onClick={() => onEdit('subtype')}><span>Subtype</span><strong>{foodDetails.subtype}</strong><Icon name="edit" size={32} /></button>
        <button onClick={() => onEdit('amount')}><span>Amount</span><strong>{foodDetails.amount}</strong><Icon name="edit" size={32} /></button>
        <button onClick={() => onEdit('frozen')}><span>Frozen</span><strong>{foodDetails.frozen}</strong><Icon name="edit" size={32} /></button>
      </div>
    </div>
  );
}

function RecognitionPanel({ config, selectedFood, foodDetails, onSelectFood, onEdit, onNavigate, onStateChange }) {
  const showRetry = ['empty', 'candidates'].includes(config.recognition);
  const panelStatus = config.recognition === 'recognizing' ? 'Camera checking' : '';
  return (
    <section className="ai-workspace-panel recognition-panel">
      <header className="ai-recognition-header">
        <div className="ai-recognition-header__start">
          <h1>Ingredients</h1>
          {showRetry ? <button className="ai-recognition-header__retry" onClick={() => onStateChange?.('AI-V02')}><Icon name="retry" size={34} />Recognize again</button> : panelStatus ? <span className="panel-status">{panelStatus}</span> : null}
        </div>
        <button className="ai-recognition-header__home" aria-label="Home" onClick={() => onNavigate?.('home')}><Icon name="home" size={38} /></button>
      </header>
      <div className="ai-panel-body">
        {config.recognition === 'empty' ? <RecognitionEmpty config={config} onNavigate={onNavigate} /> : null}
        {config.recognition === 'recognizing' ? <RecognitionLoading config={config} /> : null}
        {config.recognition === 'candidates' ? <FoodConfirmation selectedFood={selectedFood} foodDetails={foodDetails} onSelectFood={onSelectFood} onEdit={onEdit} /> : null}
        {config.recognition === 'error' ? <AIExceptionState title={config.recognitionTitle} body={config.recognitionBody} primary="Recognize again" onPrimary={() => onStateChange?.('AI-V02')} secondary="Use Manual Cook" onSecondary={() => onNavigate?.('manual')} /> : null}
        {config.recognition === 'unavailable' ? <AIExceptionState title={config.recognitionTitle} body={config.recognitionBody} icon="wifi" primary="Try again" onPrimary={() => onStateChange?.('AI-V02')} secondary="Use Manual Cook" onSecondary={() => onNavigate?.('manual')} tone="unavailable" /> : null}
      </div>
    </section>
  );
}

function RecommendationEmpty({ mode }) {
  const copy = mode === 'waiting'
    ? ['Waiting for recognition', 'Recommended settings appear after food recognition is complete.']
    : mode === 'waiting-selection'
      ? ['Preparing a recommendation', 'AI is preparing settings from the selected food and details.']
      : ['No recommended settings yet', 'Add food to generate suitable cooking settings.'];
  return <div className="recommendation-empty"><h2>{copy[0]}</h2></div>;
}

function RecommendationGenerating({ foodTitle }) {
  return <div className="recommendation-generating"><Icon name="loader" size={66} strokeWidth={1.8} className="recognition-spinner" /><h2>Generating AI plan…</h2></div>;
}

function RecommendedSettings() {
  return (
    <div className="recommended-settings">
      <dl>
        <div className="recommendation-setting recommendation-setting--icon-only"><Icon name="chefHat" size={34} /><dd>Air Fry</dd></div>
        <div className="recommendation-setting recommendation-setting--icon-only"><Icon name="temperature" size={34} /><dd>200°C</dd></div>
        <div className="recommendation-setting recommendation-setting--icon-only"><Icon name="clock" size={34} /><dd>About 15 min</dd></div>
        <div className="recommendation-setting recommendation-setting--icon-only"><Icon name="wind" size={34} /><dd>Level 5</dd></div>
      </dl>
      <PhysicalKeyHint compact />
    </div>
  );
}

function RecommendationPanel({ config, foodTitle, onRetry, onManual }) {
  return (
    <section className="ai-workspace-panel recommendation-panel">
      <header className="ai-recommendation-header"><h2><Icon name="sparkle" size={32} />AI recommendation</h2></header>
      <div className="ai-panel-body">
        {['empty', 'waiting', 'waiting-selection'].includes(config.recommendation) ? <RecommendationEmpty mode={config.recommendation} /> : null}
        {config.recommendation === 'generating' ? <RecommendationGenerating foodTitle={foodTitle} /> : null}
        {config.recommendation === 'ready' ? <RecommendedSettings /> : null}
        {config.recommendation === 'error' ? <AIExceptionState title={config.recommendationTitle} body={config.recommendationBody} primary="Generate again" onPrimary={onRetry} secondary="Use Manual Cook" onSecondary={onManual} /> : null}
        {config.recommendation === 'unavailable' ? <AIExceptionState title={config.recommendationTitle} body={config.recommendationBody} icon="wifi" tone="unavailable" /> : null}
      </div>
    </section>
  );
}

export function AIPlanWorkspace({ state, onNavigate, onStateChange }) {
  const config = aiPlanStates[state] ?? aiPlanStates['AI-V01'];
  const [selectedFood, setSelectedFood] = useState('potatoes');
  const [foodDetails, setFoodDetails] = useState({ category: 'Potatoes', subtype: 'Baby potatoes', amount: '500–800 g', frozen: 'No' });
  const [editType, setEditType] = useState(null);
  const regenerationTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(regenerationTimer.current), []);
  useEffect(() => {
    if (!['AI-V03', 'AI-V04', 'AI-V05', 'AI-E03'].includes(state)) {
      setSelectedFood('potatoes');
      setFoodDetails({ category: 'Potatoes', subtype: 'Baby potatoes', amount: '500–800 g', frozen: 'No' });
    }
  }, [state]);
  const refreshRecommendation = () => {
    window.clearTimeout(regenerationTimer.current);
    onStateChange?.('AI-V04');
    regenerationTimer.current = window.setTimeout(() => onStateChange?.('AI-V05'), 900);
  };
  const selectDetectedFood = (food) => {
    setSelectedFood(food.id);
    setFoodDetails((current) => ({ ...current, category: food.title, subtype: food.subtype }));
    refreshRecommendation();
  };
  const applyEdit = (nextValue) => {
    if (editType === 'category') {
      setSelectedFood(nextValue.categoryId);
      setFoodDetails((current) => ({ ...current, category: nextValue.category, subtype: nextValue.subtype }));
    } else {
      setFoodDetails((current) => ({ ...current, [editType]: nextValue }));
    }
    setEditType(null);
    refreshRecommendation();
  };
  const foodTitle = foodDetails.category;
  return (
    <div className="ai-workspace">
      <RecognitionPanel config={config} selectedFood={selectedFood} foodDetails={foodDetails} onSelectFood={selectDetectedFood} onEdit={setEditType} onNavigate={onNavigate} onStateChange={onStateChange} />
      <RecommendationPanel config={config} foodTitle={foodTitle} onRetry={refreshRecommendation} onManual={() => onNavigate?.('manual')} />
      {editType ? <FoodEditDialog type={editType} categoryId={selectedFood} value={foodDetails[editType]} onApply={applyEdit} onClose={() => setEditType(null)} /> : null}
    </div>
  );
}

