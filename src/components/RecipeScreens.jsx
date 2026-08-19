import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, PhysicalKeyHint } from './Primitives';
import { Icon } from './Icon';
import { ScreenShell } from './ScreenShell';
import { crispyWingsRecipe, recipeCategories, recipeLibrary, recipesById } from '../data/recipes';
import { TftKeyboard } from './TftKeyboard';
import { ParameterAdjustDialog } from './ParameterAdjustDialog';

function useRecipePageSwipe({ onPrevious, onNext, threshold = 42 }) {
  const pointer = useRef(null);
  const touchStartX = useRef(null);
  const lastPointerGestureAt = useRef(0);
  const suppressClick = useRef(false);
  const finish = (event) => {
    if (!pointer.current) return;
    const deltaX = event.clientX - pointer.current.x;
    pointer.current = null;
    if (Math.abs(deltaX) < threshold) return;
    lastPointerGestureAt.current = Date.now();
    suppressClick.current = true;
    if (deltaX < 0) onNext();
    else onPrevious();
  };
  return {
    onPointerDown: (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointer.current = { id: event.pointerId, x: event.clientX };
      try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* Preview events may not own a pointer. */ }
    },
    onPointerUp: finish,
    onPointerCancel: () => { pointer.current = null; },
    onTouchStart: (event) => {
      if (Date.now() - lastPointerGestureAt.current < 500) return;
      touchStartX.current = event.touches[0]?.clientX ?? null;
    },
    onTouchEnd: (event) => {
      if (Date.now() - lastPointerGestureAt.current < 500 || touchStartX.current == null) return;
      const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(deltaX) < threshold) return;
      suppressClick.current = true;
      if (deltaX < 0) onNext();
      else onPrevious();
    },
    onClickCapture: (event) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}

function RecipeLibrary({ onOpenRecipe }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [page, setPage] = useState(0);
  const filteredRecipes = useMemo(() => recipeLibrary.filter((recipe) => (category === 'All' || recipe.category === category) && recipe.name.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const pageCount = Math.max(1, Math.ceil(filteredRecipes.length / 6));
  const visibleRecipes = filteredRecipes.slice(page * 6, page * 6 + 6);
  const pageSwipeHandlers = useRecipePageSwipe({
    onPrevious: () => setPage((value) => Math.max(0, value - 1)),
    onNext: () => setPage((value) => Math.min(pageCount - 1, value + 1)),
  });
  useEffect(() => setPage(0), [category, query]);
  const typeSearchKey = (key) => setQuery((current) => key === 'backspace' ? current.slice(0, -1) : `${current}${key}`.slice(0, 40));
  const dismissKeyboardOnOutsidePointer = (event) => {
    if (!keyboardOpen || event.target.closest?.('.recipe-v2-toolbar label, .setup-keyboard')) return;
    setKeyboardOpen(false);
  };
  return (
    <ScreenShell className="recipes-v2-screen" onPointerDownCapture={dismissKeyboardOnOutsidePointer}>
      <div className="recipe-v2-toolbar">
        <label className={keyboardOpen ? 'is-searching' : ''}><Icon name="search" size={25} /><input value={query} onFocus={() => setKeyboardOpen(true)} onClick={() => setKeyboardOpen(true)} onChange={(event) => setQuery(event.target.value)} placeholder="Search recipes" /></label>
        <button><Icon name="star" size={24} />Favorites</button>
        <button><Icon name="clock" size={24} />History</button>
        <button><Icon name="book" size={24} />Custom recipes</button>
      </div>
      <div className="recipe-v2-library">
        <aside>
          {recipeCategories.map(([name]) => <button key={name} className={category === name ? 'is-selected' : ''} onClick={() => setCategory(name)}><span>{name}</span></button>)}
        </aside>
        <section>
          <div className="recipe-v2-grid recipe-v2-grid--swipe" {...pageSwipeHandlers}>
            {visibleRecipes.map((recipe) => <button className="recipe-v2-card" key={recipe.id} onClick={() => onOpenRecipe(recipe.id)}><img src={recipe.image} alt="" /><small className="recipe-v2-card__meta">{recipe.meta}</small><span><strong>{recipe.name}</strong></span><Icon name="star" size={22} /></button>)}
          </div>
          {pageCount > 1 ? <div className="recipe-v2-page-dots" role="status" aria-label={`Recipe page ${page + 1} of ${pageCount}`}>{Array.from({ length: pageCount }, (_, index) => <i className={index === page ? 'is-current' : ''} key={index} />)}</div> : null}
        </section>
      </div>
      {keyboardOpen ? <TftKeyboard onKey={typeSearchKey} onEnter={() => setKeyboardOpen(false)} onDismiss={() => setKeyboardOpen(false)} /> : null}
    </ScreenShell>
  );
}

function RecipeDetail({ recipe, onNext }) {
  const [checkedEquipment, setCheckedEquipment] = useState([]);
  const toggleEquipment = (item) => setCheckedEquipment((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  return (
    <ScreenShell className="recipe-v2-detail-screen">
      <div className="recipe-v2-detail">
        <section className="recipe-v2-summary">
          <div className="recipe-v2-summary__intro"><img src={recipe.image} alt={recipe.name} /><div><h2>{recipe.name}</h2></div></div>
          <div className="recipe-v2-facts">{recipe.facts.map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>
          <p className="recipe-v2-description">{recipe.description}</p>
        </section>
        <section className="recipe-v2-ingredients recipe-v2-equipment-panel">
          <header><h2>Equipment</h2></header>
          <div>{recipe.equipment.map((item) => {
            const checked = checkedEquipment.includes(item);
            return <button className={`recipe-v2-equipment-item ${checked ? 'is-checked' : ''}`} key={item} type="button" aria-pressed={checked} onClick={() => toggleEquipment(item)}><span aria-hidden="true" /><strong>{item}</strong></button>;
          })}</div>
          <Button onClick={onNext}>Next</Button>
        </section>
      </div>
    </ScreenShell>
  );
}

function RecipeIngredientsPage({ recipe, onStart }) {
  const splitAt = Math.ceil(recipe.ingredients.length / 2);
  const ingredientColumns = [recipe.ingredients.slice(0, splitAt), recipe.ingredients.slice(splitAt)];
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const toggleIngredient = (name) => setCheckedIngredients((current) => current.includes(name) ? current.filter((value) => value !== name) : [...current, name]);
  return (
    <ScreenShell className="recipe-v2-detail-screen">
      <div className="recipe-v2-detail recipe-v2-ingredients-detail">
        {ingredientColumns.map((ingredients, column) => <section className={`recipe-v2-ingredients ${column === 1 ? 'recipe-v2-ingredients--continuation' : ''}`} key={column}>
          {column === 0 ? <header><h2>Ingredients</h2></header> : null}
          <div>{ingredients.map(([name, amount]) => {
            const checked = checkedIngredients.includes(name);
            const singleLine = name.length <= 21;
            return <button className={`recipe-v2-ingredient-item ${checked ? 'is-checked' : ''} ${singleLine ? 'is-single-line' : ''}`} key={name} type="button" aria-pressed={checked} onClick={() => toggleIngredient(name)}><span aria-hidden="true" /><strong>{name}</strong><small>{amount}</small></button>;
          })}</div>
          {column === ingredientColumns.length - 1 ? <Button onClick={onStart}>Start recipe</Button> : null}
        </section>)}
      </div>
    </ScreenShell>
  );
}

function RecipeStepRail({ recipe, currentStep, selectedStep = currentStep, complete = false, onSelect }) {
  return (
    <aside className="recipe-v2-step-rail">
      <h2>{recipe.name}</h2>
      <div>{recipe.steps.map((step, index) => {
        const number = index + 1;
        const done = complete || number < currentStep;
        const current = !complete && number === currentStep;
        const selected = !complete && number === selectedStep;
        return <button key={step.title} className={`${done ? 'is-done' : ''} ${current ? 'is-current' : ''} ${selected ? 'is-selected' : ''}`} onClick={() => !complete && onSelect?.(number)} disabled={complete}><span>{done ? <Icon name="correct" size={21} /> : number}</span><strong>{step.title}</strong></button>;
      })}</div>
    </aside>
  );
}

function RecipeInstruction({ recipe, step, onStepChange, onCookStep, onBack, onStateChange }) {
  const [selectedStep, setSelectedStep] = useState(step);
  useEffect(() => setSelectedStep(step), [step]);
  const current = recipe.steps[selectedStep - 1];
  const selectStep = (nextStep) => onStepChange(Math.min(recipe.steps.length, Math.max(1, nextStep)));
  const next = () => {
    if (current.cook) return onCookStep(selectedStep - 1);
    if (selectedStep === recipe.steps.length) return onStateChange('REC-V04');
    return onStepChange(selectedStep + 1);
  };
  const isPastStep = selectedStep < step;
  const isFutureStep = selectedStep > step;
  return (
    <ScreenShell className="recipe-v2-execution-screen">
      <div className="recipe-v2-execution">
        <RecipeStepRail recipe={recipe} currentStep={step} selectedStep={selectedStep} onSelect={setSelectedStep} />
        <section className="recipe-v2-instruction">
          <div className="recipe-v2-instruction-scroll">
            <small>Step {selectedStep} of {recipe.steps.length}</small><h1>{current.title}</h1><p>{current.body}</p>
            {current.material || current.tool ? <dl>{current.material ? <div><dt>Ingredient</dt><dd>{current.material}</dd></div> : null}{current.tool ? <div><dt>Tool</dt><dd>{current.tool}</dd></div> : null}</dl> : null}
          </div>
          {!isPastStep ? (
            isFutureStep
              ? <div className="recipe-v2-step-actions is-jump"><Button onClick={() => selectStep(selectedStep)}>Go to this step</Button></div>
              : <div className="recipe-v2-step-actions"><Button variant="ghost" disabled={selectedStep === 1} onClick={() => onStepChange(Math.max(1, selectedStep - 1))}>Previous</Button><Button onClick={next}>{current.cook ? 'Review cook settings' : selectedStep === recipe.steps.length ? 'Finish recipe' : 'Next'}</Button></div>
          ) : null}
        </section>
      </div>
    </ScreenShell>
  );
}

function RecipeCookConfirm({ recipe, cookStepIndex, settings, setSettings, onBack, onSelectStep, onStart }) {
  const [editing, setEditing] = useState(false);
  const cookStep = recipe.steps[cookStepIndex];
  const rows = [['Mode', settings.mode], ['Temp', `${settings.temperature}°C`], ['Time', `${settings.time} min`], ['Fan', `Level ${settings.fan}`]];
  return (
    <ScreenShell className="recipe-v2-execution-screen">
      <div className="recipe-v2-execution">
        <RecipeStepRail recipe={recipe} currentStep={cookStepIndex + 1} onSelect={onSelectStep} />
        <section className="recipe-v2-confirm">
          <small>Step {cookStepIndex + 1} of {recipe.steps.length}</small><h1>{cookStep.title}</h1>
          <div className="recipe-v2-confirm-scroll">
            <p>Review this stage before cooking.</p>
            <div className="recipe-v2-setting-heading"><h2>Cooking settings</h2><button aria-label="Adjust settings" onClick={() => setEditing(true)}><Icon name="edit" size={36} /></button></div>
            <div className="recipe-v2-setting-grid">{rows.map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>
          </div>
          <div className="recipe-v2-confirm-footer"><Button variant="ghost" onClick={onBack}>Previous</Button><PhysicalKeyHint compact onClick={onStart} /></div>
        </section>
      </div>
      {editing ? <ParameterAdjustDialog title="Adjust settings" fields={['mode', 'temperature', 'time', 'fan']} values={settings} onChange={(field, value) => setSettings((current) => ({ ...current, [field]: value }))} onClose={() => setEditing(false)} /> : null}
    </ScreenShell>
  );
}

function RecipeRunning({ recipe, cookStepIndex, settings, setSettings, onNext, runtimeState = 'REC-V03' }) {
  const [editing, setEditing] = useState(null);
  const completedMinutes = recipe.steps.filter((step) => step.cook).reduce((total, step) => total + step.cook.time, 0);
  const runtime = {
    'REC-V03': { title: 'Cooking', label: 'Remaining', time: `${String(settings.time).padStart(2, '0')}:00`, editable: true, parameterTitle: 'Cooking settings' },
    'REC-V04': { title: 'Complete', label: 'This cook', time: `${String(completedMinutes).padStart(2, '0')}:00`, caption: 'Total cooking time', editable: false, parameterTitle: 'Cooking settings' },
    'REC-V05': { title: 'Paused', label: 'Remaining', time: `${String(settings.time).padStart(2, '0')}:00`, editable: true, parameterTitle: 'Cooking settings' },
    'REC-V06': { title: 'Drawer removed', label: 'Remaining', time: `${String(settings.time).padStart(2, '0')}:00`, editable: true, parameterTitle: 'Cooking settings' },
  }[runtimeState] ?? {};
  return (
    <ScreenShell className="recipe-v2-execution-screen">
      <div className="recipe-v2-execution">
        <RecipeStepRail recipe={recipe} currentStep={cookStepIndex + 1} />
        <section className={`recipe-v2-running is-${runtimeState.toLowerCase()} is-rec-running-layout`}>
          <div className="recipe-v2-running__time">
            <div className="recipe-v2-running__title"><h1>{runtime.title}</h1></div>
            <small>{runtime.label}</small>
            <strong>{runtime.time}</strong>
            {runtime.caption ? <span className="recipe-v2-running__time-caption">{runtime.caption}</span> : null}
            {runtime.editable ? <button onClick={() => setEditing('time')}><Icon name="edit" size={22} />Adjust Time</button> : null}
          </div>
          <div className="recipe-v2-running__camera">
            <img src={recipe.cameraImage} alt={`${recipe.name} cooking in the air fryer`} />
            <span><i />Live</span>
          </div>
          <div className="recipe-v2-running__parameters">
            <header><h2>{runtime.parameterTitle}</h2>{runtime.editable ? <button aria-label="Adjust settings" onClick={() => setEditing('settings')}><Icon name="edit" size={36} /></button> : null}</header>
            <div>
              <span><small>Mode</small><strong>{settings.mode}</strong></span>
              <span><small>Temp</small><strong>{settings.temperature}°C</strong></span>
              <span><small>Fan</small><strong>Level {settings.fan}</strong></span>
            </div>
          </div>
          {runtimeState === 'REC-V04' ? <div className="recipe-v2-running__footer"><Button onClick={onNext}>Next</Button></div> : null}
        </section>
      </div>
      {editing ? <ParameterAdjustDialog title={editing === 'time' ? 'Adjust time' : 'Adjust settings'} fields={editing === 'time' ? ['time'] : ['mode', 'temperature', 'fan']} initialField={editing === 'time' ? 'time' : 'mode'} values={settings} onChange={(field, value) => setSettings((current) => ({ ...current, [field]: value }))} onClose={() => setEditing(null)} /> : null}
    </ScreenShell>
  );
}

function RecipeComplete({ recipe, onDone }) {
  const [favorite, setFavorite] = useState(false);
  return (
    <ScreenShell className="recipe-v2-execution-screen">
      <div className="recipe-v2-execution">
        <RecipeStepRail recipe={recipe} currentStep={recipe.steps.length} complete />
        <section className="recipe-v2-complete"><img src={recipe.image} alt={recipe.name} /><div><small>Recipe complete</small><h1>{recipe.name}</h1><p>Total recipe time · {recipe.facts.find(([label]) => label === 'Total time')?.[1] ?? '—'}</p><button className={`recipe-v2-save ${favorite ? 'is-selected' : ''}`} onClick={() => setFavorite((value) => !value)}><Icon name="star" size={23} />{favorite ? 'Saved to favorites' : 'Save to favorites'}</button><Button onClick={onDone}>Done</Button></div></section>
      </div>
    </ScreenShell>
  );
}

export function RecipesScreen({ state, onNavigate, onStateChange }) {
  const [selectedRecipeId, setSelectedRecipeId] = useState('green-beans');
  const [activeStep, setActiveStep] = useState(1);
  const [cookStepIndex, setCookStepIndex] = useState(3);
  const [recipeStarted, setRecipeStarted] = useState(false);
  const selectedRecipe = recipesById[selectedRecipeId] ?? crispyWingsRecipe;
  const [cookSettings, setCookSettings] = useState(selectedRecipe.steps[cookStepIndex]?.cook ?? selectedRecipe.settings);
  const openRecipe = (recipeId) => {
    const recipe = recipesById[recipeId] ?? crispyWingsRecipe;
    setSelectedRecipeId(recipeId);
    setActiveStep(1);
    const firstCookStep = Math.max(0, recipe.steps.findIndex((step) => step.cook));
    setCookStepIndex(firstCookStep);
    setCookSettings(recipe.steps[firstCookStep]?.cook ?? recipe.settings);
    setRecipeStarted(false);
    onStateChange('REC-P02');
  };
  const openCookStep = (stepIndex) => {
    setCookStepIndex(stepIndex);
    setCookSettings(selectedRecipe.steps[stepIndex].cook);
    onStateChange('REC-V02');
  };
  const selectStepFromRail = (nextStep) => {
    setActiveStep(nextStep);
    const nextRecipeStep = selectedRecipe.steps[nextStep - 1];
    if (nextRecipeStep?.cook) return openCookStep(nextStep - 1);
    return onStateChange('REC-V01');
  };
  const leaveCookSettings = () => {
    setActiveStep(Math.max(1, cookStepIndex));
    onStateChange('REC-V01');
  };
  const goToRecipeStep = (stepIndex) => {
    const nextRecipeStep = selectedRecipe.steps[stepIndex];
    setActiveStep(stepIndex + 1);
    if (nextRecipeStep?.cook) return openCookStep(stepIndex);
    onStateChange('REC-V01');
  };
  const previousRecipeStep = () => {
    if (cookStepIndex <= 0) return onStateChange('REC-P02');
    goToRecipeStep(cookStepIndex - 1);
  };
  const nextRecipeStep = () => {
    if (cookStepIndex >= selectedRecipe.steps.length - 1) return onStateChange('REC-P02');
    goToRecipeStep(cookStepIndex + 1);
  };
  const cookConfirmProps = { recipe: selectedRecipe, cookStepIndex, settings: cookSettings, setSettings: setCookSettings, onBack: leaveCookSettings, onSelectStep: selectStepFromRail, onStart: () => onStateChange('REC-V03') };
  if (state === 'REC-P02') return <RecipeDetail recipe={selectedRecipe} onNext={() => { setRecipeStarted(false); onStateChange('REC-V01'); }} />;
  if (state === 'REC-V01' && !recipeStarted) return <RecipeIngredientsPage recipe={selectedRecipe} onStart={() => { setActiveStep(1); setRecipeStarted(true); }} />;
  if (state === 'REC-V01' && selectedRecipe.steps[activeStep - 1]?.cook) return <RecipeCookConfirm {...cookConfirmProps} />;
  if (state === 'REC-V01') return <RecipeInstruction recipe={selectedRecipe} step={activeStep} onStepChange={setActiveStep} onCookStep={openCookStep} onBack={() => onStateChange('REC-P02')} onStateChange={onStateChange} />;
  if (state === 'REC-V02') return <RecipeCookConfirm {...cookConfirmProps} />;
  if (['REC-V03', 'REC-V04', 'REC-V05', 'REC-V06'].includes(state)) return <RecipeRunning recipe={selectedRecipe} cookStepIndex={cookStepIndex} settings={cookSettings} setSettings={setCookSettings} onNext={nextRecipeStep} runtimeState={state} />;
  return <RecipeLibrary onOpenRecipe={openRecipe} />;
}
