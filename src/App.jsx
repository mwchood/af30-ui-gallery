import { useEffect, useMemo, useState } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import {
  AIPlanScreen,
  CookingScreen,
  HomeScreen,
  ManualScreen,
  PreheatScreen,
} from './components/Screens';
import { RecipesScreen } from './components/RecipeScreens';
import { OnboardingScreen } from './components/OnboardingScreens';
import { screenCatalog } from './data/screens';

const GALLERY_VERSION = 'v0.3';

function readRoute() {
  const params = new URLSearchParams(window.location.search);
  const pageId = params.get('page') ?? 'home';
  const page = screenCatalog.find((item) => item.id === pageId) ?? screenCatalog[0];
  const requestedState = params.get('state');
  return { page: page.id, state: page.states.includes(requestedState) ? requestedState : page.defaultState };
}

export default function App() {
  const initial = useMemo(readRoute, []);
  const deviceOnly = useMemo(() => new URLSearchParams(window.location.search).get('preview') === 'device', []);
  const [pageId, setPageId] = useState(initial.page);
  const [stateId, setStateId] = useState(initial.state);
  const currentPage = screenCatalog.find((item) => item.id === pageId) ?? screenCatalog[0];
  const deliverableSizingClass = pageId === 'ai-plan' ? '' : 'physical-v2';

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageId);
    url.searchParams.set('state', stateId);
    url.searchParams.delete('physical');
    window.history.replaceState({}, '', url);
  }, [pageId, stateId]);

  const changePage = (nextPageId) => {
    const next = screenCatalog.find((item) => item.id === nextPageId);
    setPageId(next.id);
    setStateId(next.defaultState);
  };

  const screens = {
    home: <HomeScreen state={stateId} onNavigate={changePage} />,
    'ai-plan': <AIPlanScreen state={stateId} onNavigate={changePage} onStateChange={setStateId} />,
    manual: <ManualScreen state={stateId} onNavigate={changePage} onStateChange={setStateId} />,
    cooking: <CookingScreen state={stateId} onNavigate={changePage} onStateChange={setStateId} />,
    recipes: <RecipesScreen state={stateId} onNavigate={changePage} onStateChange={setStateId} />,
    preheat: <PreheatScreen state={stateId} onNavigate={changePage} />,
    setup: <OnboardingScreen state={stateId} onNavigate={changePage} onStateChange={setStateId} />,
  };

  return (
    <div className={`gallery-app ${deviceOnly ? 'gallery-app--device-only' : ''}`}>
      <aside className="gallery-controls">
        <div className="gallery-brand"><span>AF30</span><strong>UI system</strong><small>SV03 visual adaptation · {GALLERY_VERSION}</small></div>
        <label>Version<select aria-label="Version" value={GALLERY_VERSION} disabled><option value="v0.3">v0.3 · Working</option></select></label>
        <label>Page<select aria-label="Page" value={pageId} onChange={(event) => changePage(event.target.value)}>{screenCatalog.map((page) => <option value={page.id} key={page.id}>{page.label}</option>)}</select></label>
        <label>State<select aria-label="State" value={stateId} onChange={(event) => setStateId(event.target.value)}>{currentPage.states.map((state) => <option value={state} key={state}>{state}</option>)}</select></label>
        <div className="gallery-note"><strong>1280 × 720</strong><span>Deliverable device sizing</span><span>Fixed device canvas</span><span>URL mirrors selection</span></div>
        <div className="gallery-doc-path">Docs: <code>design-system/</code></div>
      </aside>
      <DeviceFrame className={deliverableSizingClass}>{screens[pageId]}</DeviceFrame>
    </div>
  );
}
