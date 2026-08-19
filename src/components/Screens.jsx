import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { assetPath } from '../assetPath';
import { AIRecommendation } from './AIRecommendation';
import { AIPlanWorkspace } from './AIPlanWorkspace';
import { ScreenShell } from './ScreenShell';
import { FoodEditDialog, getFoodCategory } from './FoodEditDialog';
import { ParameterAdjustDialog } from './ParameterAdjustDialog';
import {
  Button,
  GlobalInfo,
  Notice,
  ParameterCard,
  PhysicalKeyHint,
  ProgressRing,
  Segmented,
  Surface,
  TopBar,
} from './Primitives';

function HomeV2({ state, onNavigate }) {
  const noRecent = state === 'HOME-V02';
  const overlay = state === 'HOME-O01';
  const entries = [
    { page: 'manual', title: 'Manual', icon: 'chefHat', iconSize: 96 },
    { page: 'recipes', title: 'Recipes', icon: 'book', iconSize: 86, strokeWidth: 2.4 },
    { page: 'preheat', title: 'Preheat', icon: 'waves', iconSize: 76 },
  ];
  return (
    <ScreenShell className="home-v2-screen">
      <div className="home-v2-entry-grid">
        <button className="home-v2-entry home-v2-entry--hero" onClick={() => onNavigate?.('ai-plan')}>
          <img src={assetPath('/assets/home-ai-cook-hero-v2.png')} alt="Roasted chicken in an air fryer basket" />
          <span className="home-v2-entry__shade" />
          <span className="home-v2-entry__hero-icon"><Icon name="camera" size={58} strokeWidth={2.2} /></span>
          <span className="home-v2-entry__copy"><strong>Ai Cook</strong></span>
          <span className="home-v2-entry__go"><Icon name="chevron" size={31} /></span>
        </button>
        {entries.map((entry) => (
          <button className="home-v2-entry home-v2-entry--secondary" key={entry.title} onClick={() => onNavigate?.(entry.page)}>
            <span className="home-v2-entry__icon"><Icon name={entry.icon} size={entry.iconSize} strokeWidth={entry.strokeWidth} /></span>
            <span className="home-v2-entry__copy"><strong>{entry.title}</strong></span>
            <span className="home-v2-entry__go"><Icon name="chevron" size={28} /></span>
          </button>
        ))}
      </div>
      <div className="home-v2-bottom">
        {noRecent ? (
          <div className="home-v2-recent home-v2-recent--empty">
            <span className="home-v2-recent__label">Recent</span>
            <span>No recent cook yet</span>
          </div>
        ) : (
          <button className="home-v2-recent" onClick={() => onNavigate?.('manual')}>
            <span className="home-v2-recent__label">Recent</span>
            <span className="home-v2-recent__item"><strong>Air Fry</strong></span>
            <span className="home-v2-recent__item"><strong>180°C</strong></span>
            <span className="home-v2-recent__item"><strong>18 min</strong></span>
            <span className="home-v2-recent__play"><Icon name="play" size={27} /></span>
          </button>
        )}
      </div>
      {overlay ? <div className="overlay"><Surface className="dialog"><h2>AI Cook needs a connection</h2><p>Connect to Wi-Fi to use food recognition and AI monitoring.</p><div className="dialog__actions"><Button variant="ghost">Cancel</Button><Button>Connect</Button></div></Surface></div> : null}
    </ScreenShell>
  );
}

export function HomeScreen({ state, onNavigate }) {
  return <HomeV2 state={state} onNavigate={onNavigate} />;
}

const manualModes = [
  { name: 'Steak', temperature: 220, time: 8, fan: 4 },
  { name: 'Bacon', temperature: 205, time: 9, fan: 4 },
  { name: 'Roast', temperature: 190, time: 14, fan: 5 },
  { name: 'Bake', temperature: 160, time: 20, fan: 3 },
  { name: 'Air Fry', temperature: 180, time: 18, fan: 5 },
  { name: 'Toast', temperature: 195, time: 5, fan: 3 },
  { name: 'Grill', temperature: 220, time: 8, fan: 3 },
  { name: 'Reheat', temperature: 165, time: 6, fan: 4 },
];
const fanLevels = [1, 2, 3, 4, 5];

function useHorizontalSwipe({ onPrevious, onNext, threshold = 42 }) {
  const pointer = useRef(null);
  const suppressClick = useRef(false);

  const finish = (event) => {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
    pointer.current = null;
    if (!isHorizontalSwipe) return;
    suppressClick.current = true;
    window.setTimeout(() => { suppressClick.current = false; }, 0);
    if (deltaX < 0) onNext();
    else onPrevious();
  };

  return {
    onPointerDown: (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* Synthetic preview events do not own a pointer. */ }
    },
    onPointerUp: finish,
    onPointerCancel: () => { pointer.current = null; },
    onClickCapture: (event) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}

function ManualScale({ label, value, before, after, unit, onDecrease, onIncrease }) {
  const swipeHandlers = useHorizontalSwipe({ onPrevious: onDecrease, onNext: onIncrease });
  return (
    <div className="manual-scale">
      <span className="manual-control-label">{label}</span>
      <div
        className="manual-scale__control manual-swipe-control"
        role="slider"
        tabIndex={0}
        aria-label={`${label}: ${value}${unit}`}
        aria-valuenow={value}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); onDecrease(); }
          if (event.key === 'ArrowRight') { event.preventDefault(); onIncrease(); }
        }}
        {...swipeHandlers}
      >
        <button className="manual-scale__step" aria-label={`Decrease ${label}`} onClick={onDecrease}><Icon name="minus" size={34} /></button>
        <div className="manual-scale__center">
          <div className="manual-scale__ticks" aria-hidden="true">
            {Array.from({ length: 31 }, (_, index) => <i className={index === 15 ? 'is-center' : ''} key={index} />)}
          </div>
          <strong>{value}{unit}</strong>
        </div>
        <button className="manual-scale__step" aria-label={`Increase ${label}`} onClick={onIncrease}><Icon name="plus" size={34} /></button>
      </div>
    </div>
  );
}

export function ManualScreen({ state, onNavigate, onStateChange }) {
  const [settings, setSettings] = useState({ mode: 'Air Fry', temperature: 180, time: 18, fan: 5 });
  const [selectedFood, setSelectedFood] = useState('potatoes');
  const [foodDetails, setFoodDetails] = useState({ category: 'Potatoes', subtype: 'Baby potatoes', amount: '500–800 g', frozen: 'No' });
  const [foodEditType, setFoodEditType] = useState(null);
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const regenerationTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(regenerationTimer.current), []);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const baseRecommendations = {
    chicken: { mode: 'Air Fry', temperature: 200, time: 15, fan: 5 },
    potatoes: { mode: 'Air Fry', temperature: 190, time: 22, fan: 4 },
    pumpkin: { mode: 'Air Fry', temperature: 185, time: 18, fan: 4 },
    other: { mode: 'Air Fry', temperature: 180, time: 18, fan: 3 },
  };
  const baseRecommendation = baseRecommendations[selectedFood] ?? baseRecommendations.other;
  const recommendation = { ...baseRecommendation, time: baseRecommendation.time + (foodDetails.frozen === 'Yes' ? 3 : 0) };
  const regenerateRecommendation = () => {
    window.clearTimeout(regenerationTimer.current);
    onStateChange?.('MAN-AI-CS05');
    regenerationTimer.current = window.setTimeout(() => onStateChange?.('MAN-AI-CS06'), 900);
  };
  const selectFood = (foodId, subtype) => {
    setSelectedFood(foodId);
    setFoodDetails((current) => ({ ...current, category: getFoodCategory(foodId).title, subtype }));
  };
  const applyFoodEdit = (nextValue) => {
    if (foodEditType === 'category') {
      setSelectedFood(nextValue.categoryId);
      setFoodDetails((current) => ({ ...current, category: nextValue.category, subtype: nextValue.subtype }));
    } else {
      setFoodDetails((current) => ({ ...current, [foodEditType]: nextValue }));
    }
    setFoodEditType(null);
  };
  const applyRecommendation = () => setSettings(recommendation);
  const selectMode = (mode) => setSettings({ mode: mode.name, temperature: mode.temperature, time: mode.time, fan: mode.fan });

  return (
    <ScreenShell className="manual-screen">
      <div className="manual-layout">
        <section className="manual-parameters">
          <button className="manual-home-button" aria-label="Home" onClick={() => onNavigate?.('home')}><Icon name="home" size={38} /></button>
          <div className="manual-mode-row">
            <span className="manual-control-label">Mode</span>
            <div className="manual-mode-current">
              <strong>{settings.mode}</strong>
              <button className="manual-mode-edit" aria-label="Edit mode" onClick={() => setModeDialogOpen(true)}><Icon name="edit" size={36} /></button>
            </div>
          </div>
          <ManualScale label="Temp" value={settings.temperature} before={Math.max(30, settings.temperature - 5)} after={Math.min(230, settings.temperature + 5)} unit="°C" onDecrease={() => update('temperature', Math.max(30, settings.temperature - 5))} onIncrease={() => update('temperature', Math.min(230, settings.temperature + 5))} />
          <ManualScale label="Time" value={settings.time} before={Math.max(1, settings.time - 1)} after={Math.min(60, settings.time + 1)} unit=" min" onDecrease={() => update('time', Math.max(1, settings.time - 1))} onIncrease={() => update('time', Math.min(60, settings.time + 1))} />
          <div className="manual-fan-row">
            <span className="manual-control-label">Fan</span>
            <div className="manual-fan-levels">
              {fanLevels.map((level) => <button className={settings.fan === level ? 'is-selected' : ''} key={level} onClick={() => update('fan', level)}>{level}</button>)}
            </div>
          </div>
        </section>
        <div className="manual-side">
          <AIRecommendation
            state={state}
            selectedFood={selectedFood}
            foodDetails={foodDetails}
            recommendation={recommendation}
            onSelectFood={selectFood}
            onSelectOther={() => setFoodEditType('category')}
            onEditDetail={setFoodEditType}
            onApply={applyRecommendation}
            onRetry={() => onStateChange?.('MAN-AI-CS02')}
            onGenerate={regenerateRecommendation}
            onPreheat={() => onNavigate?.('preheat', 'PRE-P01')}
          />
          <PhysicalKeyHint compact />
        </div>
      </div>
      {foodEditType ? <FoodEditDialog type={foodEditType} categoryId={selectedFood} value={foodDetails[foodEditType]} onApply={applyFoodEdit} onClose={() => setFoodEditType(null)} /> : null}
      {modeDialogOpen ? <ParameterAdjustDialog title="Adjust mode" fields={['mode']} initialField="mode" values={{ mode: settings.mode }} onChange={(field, value) => { const nextMode = manualModes.find((mode) => mode.name === value); if (nextMode) selectMode(nextMode); }} onClose={() => setModeDialogOpen(false)} /> : null}
    </ScreenShell>
  );
}

export function AIPlanScreen({ state, onNavigate, onStateChange }) {
  return <ScreenShell className="ai-plan-screen"><AIPlanWorkspace state={state} onNavigate={onNavigate} onStateChange={onStateChange} /></ScreenShell>;
}

function CookingSettings({ mode, temperature, fan, paused, manual, onEdit }) {
  return (
    <section className={`cooking-settings-block ${manual || paused ? 'has-adjustment' : ''}`}>
      <div className="cooking-section-heading">
        <h3>Cooking settings</h3>
        {(manual || paused) ? <button aria-label="Adjust settings" onClick={onEdit}><Icon name="edit" size={32} /></button> : null}
      </div>
      <div className="cooking-settings-grid">
        <span><small>Mode</small><strong>{mode}</strong></span>
        <span><small>Temp</small><strong>{temperature}°C</strong></span>
        <span><small>Fan</small><strong>Level {fan}</strong></span>
      </div>
    </section>
  );
}

function CookingCamera({ drawer, onExpand }) {
  return (
    <div className={`cooking-camera ${drawer ? 'is-paused' : ''}`}>
      <img src={assetPath('/assets/cooking-camera-potatoes-v1.png')} alt="Roasted pepper potatoes in the air fryer basket" />
      <span className={`cooking-camera__live ${drawer ? 'is-paused' : ''}`}>{drawer ? 'Paused' : <><i />Live</>}</span>
      <button className="cooking-camera__expand" type="button" aria-label="Expand camera view" onClick={onExpand}><Icon name="maximize" size={28} /></button>
      {drawer ? <div className="cooking-camera__blocked"><Icon name="info" size={38} /><strong>Live view paused</strong><span>Reinsert the drawer</span></div> : null}
    </div>
  );
}

export function CookingScreen({ state, onNavigate, onStateChange }) {
  const paused = state === 'CWB-V04';
  const drawer = state === 'CWB-V05';
  const complete = state === 'CWB-V06';
  const manual = state === 'CWB-V03' || state === 'CWB-CS01';
  const overtime = state === 'CWB-V02';
  const degraded = state === 'CWB-CS01';
  const [editorMode, setEditorMode] = useState(null);
  const [degradeToastVisible, setDegradeToastVisible] = useState(degraded);
  const [temperature, setTemperature] = useState(180);
  const [manualTime, setManualTime] = useState(18);
  const [cookingMode, setCookingMode] = useState('Air Fry');
  const [fan, setFan] = useState(3);
  const [amount, setAmount] = useState('1000–1300 g');
  const [frozen, setFrozen] = useState('No');
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [cameraExpanded, setCameraExpanded] = useState(false);
  const guidanceRef = useRef(null);
  const timer = overtime ? '19:24' : manual || paused || drawer ? '08:30' : '06:12';
  const timerLabel = manual || paused || drawer ? 'Remaining' : 'Elapsed';
  const pageTitle = drawer ? 'Drawer removed' : paused ? 'Paused' : manual ? 'Manual Cooking' : 'AI Cooking';
  const pageSubtitle = 'AI doneness monitoring · stops automatically when ready.';
  const showGuidanceTrigger = !manual && !paused && !drawer;
  useEffect(() => {
    if (!guidanceOpen) return undefined;
    const closeGuidance = (event) => {
      if (!guidanceRef.current?.contains(event.target)) setGuidanceOpen(false);
    };
    document.addEventListener('pointerdown', closeGuidance);
    return () => document.removeEventListener('pointerdown', closeGuidance);
  }, [guidanceOpen]);
  useEffect(() => {
    if (!degraded) {
      setDegradeToastVisible(false);
      return undefined;
    }
    setDegradeToastVisible(true);
    const timeout = window.setTimeout(() => setDegradeToastVisible(false), 3200);
    return () => window.clearTimeout(timeout);
  }, [degraded]);
  if (complete) {
    return (
      <ScreenShell className="cooking-screen cooking-complete-screen">
        <div className="cooking-layout">
          <div className="cooking-camera-column is-tall">
            <CookingCamera onExpand={() => setCameraExpanded(true)} />
          </div>
          <section className="cooking-runtime cooking-runtime--ai cooking-runtime--complete">
            <div className="cooking-runtime-heading"><h1>Cooking complete</h1></div>
            <div className="cooking-time"><small>This cook</small><div className="cooking-time-value"><strong>14:42</strong><span className="cooking-complete-time-caption">Total cooking time</span></div></div>
            <CookingSettings mode={cookingMode} temperature={temperature} fan={fan} paused={false} manual={false} />
            <div className="cooking-complete-actions"><Button variant="ghost" icon="retry" onClick={() => onStateChange?.('CWB-V01')}>Cook again</Button><Button icon="home" onClick={() => onNavigate?.('home')}>Home</Button></div>
          </section>
        </div>
        {cameraExpanded ? <div className="cooking-camera-fullscreen" role="dialog" aria-modal="true" aria-label="Expanded camera view" onClick={() => setCameraExpanded(false)}><div className="cooking-camera-fullscreen__content" onClick={(event) => event.stopPropagation()}><img src={assetPath('/assets/cooking-camera-potatoes-v1.png')} alt="Roasted pepper potatoes in the air fryer basket" /><button type="button" aria-label="Close expanded camera view" onClick={() => setCameraExpanded(false)}><Icon name="close" size={30} /><span>Close</span></button></div></div> : null}
      </ScreenShell>
    );
  }
  return (
    <ScreenShell className="cooking-screen">
      <div className="cooking-layout">
        <div className={`cooking-camera-column ${manual ? 'is-tall' : ''}`}>
          <CookingCamera drawer={drawer} onExpand={() => setCameraExpanded(true)} />
          {!manual ? <div className="cooking-ingredient-strip"><span><small>Food</small><strong>Pepper potatoes</strong></span><button onClick={() => setAmount((value) => value === '1000–1300 g' ? '750–1050 g' : '1000–1300 g')}><small>Amount</small><strong>{amount}</strong><Icon name="edit" size={32} /></button><button onClick={() => setFrozen((value) => value === 'No' ? 'Yes' : 'No')}><small>Frozen</small><strong>{frozen}</strong><Icon name="edit" size={32} /></button></div> : null}
        </div>
        <section className="cooking-runtime cooking-runtime--ai">
          <div className={`cooking-runtime-heading ${guidanceOpen ? 'is-guidance-open' : ''}`} ref={showGuidanceTrigger ? guidanceRef : null}>
            <div className="cooking-runtime-title-row"><h1>{pageTitle}</h1>{paused ? <button className="cooking-end-button" onClick={() => onStateChange?.('CWB-V06')}>End</button> : null}{showGuidanceTrigger ? <button className="cooking-guidance-trigger" aria-label="Show AI cooking guidance" aria-expanded={guidanceOpen} onClick={() => setGuidanceOpen((open) => !open)}><Icon name="info" size={32} /></button> : null}</div>
            {showGuidanceTrigger && guidanceOpen ? <p className="cooking-guidance" role="note">{pageSubtitle}</p> : null}
          </div>
          <div className="cooking-time"><small>{timerLabel}</small><div className="cooking-time-value"><strong>{timer}</strong>{manual && !drawer ? <button className="cooking-time-edit" onClick={() => setEditorMode('time')} aria-label="Adjust time"><Icon name="edit" size={32} /></button> : null}</div></div>
          <div className={`cooking-timeline ${overtime ? 'is-monitoring' : ''} ${!overtime ? 'is-two-column' : ''}`}>
            <span><i style={{ width: overtime ? '100%' : manual || paused || drawer ? '58%' : '48%' }} /></span>
            {overtime
              ? <div className="cooking-monitoring-status"><i /><span><strong>AI is continuously monitoring doneness</strong></span></div>
              : <div>{manual || paused || drawer ? <><small>Total<strong>{manualTime}:00</strong></small><small>Ends<strong>20:42</strong></small></> : <><small>Start<strong>00:00</strong></small><small>Est. done<strong>{amount === '750–1050 g' ? '16:30' : '18:00'}</strong></small></>}</div>}
          </div>
          <CookingSettings mode={cookingMode} temperature={temperature} fan={fan} paused={paused} manual={manual || paused || drawer} onEdit={() => setEditorMode('settings')} />
        </section>
      </div>
        {cameraExpanded ? <div className="cooking-camera-fullscreen" role="dialog" aria-modal="true" aria-label="Expanded camera view" onClick={() => setCameraExpanded(false)}><div className="cooking-camera-fullscreen__content" onClick={(event) => event.stopPropagation()}><img src={assetPath('/assets/cooking-camera-potatoes-v1.png')} alt="Roasted pepper potatoes in the air fryer basket" /><button type="button" aria-label="Close expanded camera view" onClick={() => setCameraExpanded(false)}><Icon name="close" size={30} /><span>Close</span></button></div></div> : null}
      {degraded && degradeToastVisible ? <div className="cooking-toast" role="status"><Notice tone="warning" title="AI monitoring stopped">Cooking continues with the current Manual settings.</Notice></div> : null}
      {editorMode ? <ParameterAdjustDialog title={editorMode === 'time' ? 'Adjust time' : 'Adjust settings'} fields={editorMode === 'time' ? ['time'] : ['mode', 'temperature', 'fan']} initialField={editorMode === 'time' ? 'time' : 'mode'} values={{ mode: cookingMode, temperature, time: manualTime, fan }} onChange={(field, value) => { if (field === 'mode') setCookingMode(value); if (field === 'temperature') setTemperature(value); if (field === 'time') setManualTime(value); if (field === 'fan') setFan(value); }} onClose={() => setEditorMode(null)} /> : null}
    </ScreenShell>
  );
}

export function PreheatScreen({ state, onNavigate }) {
  const running = state === 'PRE-V01';
  const complete = state === 'PRE-V02';
  const [targetTemp, setTargetTemp] = useState(200);
  const currentTemp = complete ? targetTemp : running ? 146 : 82;
  const estimatedMinutes = Math.max(1, Math.ceil((targetTemp - currentTemp) / 25));
  const estimatedSeconds = estimatedMinutes * 60;
  const [countdownSeconds, setCountdownSeconds] = useState(estimatedSeconds);
  const countdown = `${String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:${String(countdownSeconds % 60).padStart(2, '0')}`;
  const heatProgress = Math.max(0, Math.min(100, ((currentTemp - 25) / (targetTemp - 25)) * 100));
  const changeTarget = (delta) => setTargetTemp((current) => Math.min(230, Math.max(150, current + delta)));
  const targetSwipeHandlers = useHorizontalSwipe({ onPrevious: () => changeTarget(-5), onNext: () => changeTarget(5) });

  useEffect(() => {
    setCountdownSeconds(estimatedSeconds);
    if (!running) return undefined;
    const timer = window.setInterval(() => setCountdownSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, estimatedSeconds]);

  return (
    <ScreenShell title="Preheat" className={`preheat-screen preheat-v2-screen ${running ? 'is-running' : ''} ${complete ? 'is-complete' : ''}`} onBack={() => onNavigate?.('home')}>
      {running || complete ? (
        <div className="preheat-running-layout">
          <section className="preheat-countdown-panel">
            {complete ? (
              <div className="preheat-finished-message">
                <span className="preheat-complete-icon"><Icon name="correct" size={42} /></span>
                <h2>Preheat complete</h2>
              </div>
            ) : (
              <>
                <span className="preheat-running-label"><i />Heating cavity</span>
                <span className="preheat-countdown-label">Time remaining</span>
                <strong className="preheat-countdown-value">{countdown}</strong>
                <div
                  className="preheat-linear-progress"
                  role="progressbar"
                  aria-label="Preheat progress"
                  aria-valuemin={25}
                  aria-valuemax={targetTemp}
                  aria-valuenow={currentTemp}
                >
                  <span style={{ width: `${heatProgress}%` }} />
                </div>
              </>
            )}
          </section>
          <aside className="preheat-running-temperatures">
            <div>
              <span>Current temp</span>
              <strong>{currentTemp}<small>°C</small></strong>
            </div>
            <div>
              <span>Target temp</span>
              <strong>{targetTemp}<small>°C</small></strong>
            </div>
          </aside>
        </div>
      ) : <div className="preheat-v2-layout">
        <section className="preheat-current">
          <span className="preheat-v2-label">Current cavity</span>
          <strong className="preheat-v2-temperature"><span>{currentTemp}</span><small>°C</small></strong>
        </section>
        <section className="preheat-target">
            <>
              <span className="preheat-v2-label">Target temp</span>
              <strong className="preheat-v2-temperature preheat-target-value"><span>{targetTemp}</span><small>°C</small></strong>
              <div
                className="preheat-target-scale manual-swipe-control"
                role="slider"
                tabIndex={0}
                aria-label={`Target temp: ${targetTemp}°C`}
                aria-valuemin={150}
                aria-valuemax={230}
                aria-valuenow={targetTemp}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') { event.preventDefault(); changeTarget(-5); }
                  if (event.key === 'ArrowRight') { event.preventDefault(); changeTarget(5); }
                }}
                {...targetSwipeHandlers}
              >
                <div className="preheat-target-ticks" aria-hidden="true">{Array.from({ length: 31 }, (_, index) => <i className={index === 15 ? 'is-center' : ''} key={index} />)}</div>
                <button aria-label="Decrease target temp" onClick={() => changeTarget(-5)}>{Math.max(150, targetTemp - 5)}°C</button>
                <button aria-label="Increase target temp" onClick={() => changeTarget(5)}>{Math.min(230, targetTemp + 5)}°C</button>
              </div>
              <div className="preheat-estimate"><span>About</span><strong>{estimatedMinutes}</strong><span>min</span></div>
            </>
        </section>
      </div>}
      <div className={`preheat-v2-footer ${complete ? 'is-complete' : running ? 'is-stop' : ''}`}>
        {complete
          ? <Button onClick={() => onNavigate?.('home')}>Done</Button>
          : running
            ? <Button variant="danger" onClick={() => onNavigate?.('preheat', 'PRE-P01')}>Stop</Button>
            : <PhysicalKeyHint compact />}
      </div>
    </ScreenShell>
  );
}
