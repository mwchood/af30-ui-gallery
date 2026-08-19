import { useEffect, useState } from 'react';
import {
  Bell,
  Check,
  CircleAlert,
  ShieldCheck,
  Sparkles,
  Smartphone,
  UserRound,
  Wifi,
} from 'lucide-react';
import { Icon } from './Icon';
import { assetPath } from '../assetPath';

const languageOptions = ['Dansk', 'Deutsch', 'English', 'Français', 'Nederlands', 'Norsk', 'Suomi', 'Svenska', 'Русский'];
const regionOptions = [
  { label: '美国', flag: '🇺🇸' },
  { label: '英国', flag: '🇬🇧' },
  { label: '德国', flag: '🇩🇪' },
  { label: '法国', flag: '🇫🇷' },
];

function SetupBack({ onClick }) {
  return <button className="setup-back" aria-label="返回" onClick={onClick}><Icon name="back" size={42} /></button>;
}

function SetupButton({ children, variant = 'primary', className = '', onClick }) {
  return <button className={`setup-button is-${variant} ${className}`} onClick={onClick}>{children}</button>;
}

function SetupLink({ children, className = '', onClick }) {
  return <button className={`setup-link ${className}`} onClick={onClick}>{children}</button>;
}

function SetupHeader({ title, eyebrow, onBack }) {
  return (
    <header className="setup-header">
      {onBack ? <SetupBack onClick={onBack} /> : null}
      <div>
        {eyebrow ? <span className="setup-eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
      </div>
    </header>
  );
}

function SetupFooter({ primary, onPrimary, secondary, onSecondary, tertiary, onTertiary }) {
  return (
    <footer className="setup-footer">
      <div>{tertiary ? <SetupLink onClick={onTertiary}>{tertiary}</SetupLink> : null}</div>
      <div className="setup-footer__actions">
        {secondary ? <SetupButton variant="secondary" onClick={onSecondary}>{secondary}</SetupButton> : null}
        {primary ? <SetupButton onClick={onPrimary}>{primary}</SetupButton> : null}
      </div>
    </footer>
  );
}

export function OnboardingScreen({ state, onNavigate, onStateChange }) {
  const [language, setLanguage] = useState('English');
  const [region, setRegion] = useState('美国');
  const go = (nextState) => onStateChange?.(nextState);
  const finish = () => onNavigate?.('home');

  useEffect(() => {
    if (state !== 'SET-BOOT-V01' && state !== 'SET-BOOT-V02') return undefined;
    const nextState = state === 'SET-BOOT-V01' ? 'SET-BOOT-V02' : 'SET-LOCALE-V01';
    const timeout = window.setTimeout(() => go(nextState), state === 'SET-BOOT-V01' ? 1400 : 1800);
    return () => window.clearTimeout(timeout);
  }, [state]);

  if (state === 'SET-BOOT-V01') {
    return <div className="setup-screen setup-start" onClick={() => go('SET-BOOT-V02')}><p>正在启动 Typhur 空气炸锅</p><span className="setup-start-line" /></div>;
  }

  if (state === 'SET-BOOT-V02') {
    return <div className="setup-screen setup-intro" onClick={() => go('SET-LOCALE-V01')}><img src={assetPath('/assets/setup/typhur-particle-logo.png')} alt="Typhur" /></div>;
  }

  if (state === 'SET-LOCALE-V01') {
    return (
      <div className="setup-screen setup-locale-screen">
        <SetupHeader eyebrow="首次开机" title="选择语言" />
        <main className="setup-choice-list is-scrollable">
          {languageOptions.map((item) => (
            <button className={language === item ? 'is-selected' : ''} key={item} onClick={() => setLanguage(item)}>
              <strong>{item}</strong>
              {language === item ? <Check size={32} /> : null}
            </button>
          ))}
        </main>
        <SetupFooter primary="下一步" onPrimary={() => go('SET-LOCALE-V02')} />
      </div>
    );
  }

  if (state === 'SET-LOCALE-V02') {
    return (
      <div className="setup-screen setup-locale-screen">
        <SetupHeader eyebrow="首次开机" title="选择地区" onBack={() => go('SET-LOCALE-V01')} />
        <main className="setup-choice-list">
          {regionOptions.map((item) => (
            <button className={region === item.label ? 'is-selected' : ''} key={item.label} onClick={() => setRegion(item.label)}>
              <span className="setup-choice-flag" aria-hidden="true">{item.flag}</span>
              <strong>{item.label}</strong>
              {region === item.label ? <Check size={32} /> : null}
            </button>
          ))}
        </main>
        <SetupFooter primary="下一步" onPrimary={() => go('SET-APP-V01')} />
      </div>
    );
  }

  if (state === 'SET-APP-V01') {
    return (
      <div className="setup-screen setup-app-entry">
        <main className="setup-entry-copy">
          <h1>设置您的<br />Typhur 空气炸锅</h1>
          <p>使用 Typhur App 连接 Wi-Fi，并将本机关联至您的账号。</p>
          <ul className="setup-benefit-list">
            <li><UserRound size={32} /><span>保存烹饪记录和偏好</span></li>
            <li><Bell size={32} /><span>接收烹饪通知和产品更新</span></li>
            <li><Smartphone size={32} /><span>在手机上管理设备</span></li>
            <li><ShieldCheck size={32} /><span>申请产品延长保修服务</span></li>
            <li><Sparkles size={32} /><span>联网后使用设备的 AI 功能</span></li>
          </ul>
        </main>
        <aside className="setup-entry-action">
          <img src={assetPath('/assets/setup/pair-devices.svg')} alt="手机与 Typhur 空气炸锅连接示意" />
          <SetupButton onClick={() => go('SET-APP-V02')}>使用 App 开始设置</SetupButton>
          <SetupLink onClick={() => go('SET-BOOT-V03')}>稍后设置</SetupLink>
        </aside>
      </div>
    );
  }

  if (state === 'SET-APP-V02') {
    return (
      <div className="setup-screen setup-app-download">
        <SetupHeader eyebrow="APP 配网" title="获取 Typhur App" onBack={() => go('SET-APP-V01')} />
        <main className="setup-app-guide">
          <ol>
            <li><span>1</span><div><strong>下载或打开 Typhur App</strong><small>使用手机扫描二维码</small></div></li>
            <li><span>2</span><div><strong>登录或创建账号</strong><small>本机将关联至该账号</small></div></li>
            <li><span>3</span><div><strong>进入「设备」并点击「添加设备」</strong><small>配对期间请保持本页面打开</small></div></li>
          </ol>
          <div className="setup-qr-card">
            <img src={assetPath('/assets/setup/typhur-app-qr.png')} alt="Typhur App 下载二维码" />
            <strong>扫码下载 App</strong>
            <small>或在应用商店搜索「Typhur」</small>
          </div>
        </main>
        <SetupFooter primary="继续" onPrimary={() => go('SET-APP-V03')} />
      </div>
    );
  }

  if (state === 'SET-APP-V03') {
    return (
      <div className="setup-screen setup-centered-state setup-app-waiting">
        <SetupHeader eyebrow="APP 配网" title="正在等待 Typhur App" onBack={() => go('SET-APP-V02')} />
        <main>
          <div className="setup-pairing-orbit"><Smartphone size={72} /><span><Wifi size={36} /></span></div>
          <h2>空气炸锅已准备好配对</h2>
          <p>请在 Typhur App 中按步骤操作。<br />保持 App 打开，并靠近本机。</p>
        </main>
        <SetupFooter secondary="取消" onSecondary={() => go('SET-APP-V01')} />
      </div>
    );
  }

  if (state === 'SET-APP-V05') {
    return (
      <div className="setup-screen setup-result-screen">
        <main>
          <div className="setup-result-icon is-success"><Check size={72} /></div>
          <h1>空气炸锅已就绪</h1>
        </main>
        <SetupButton onClick={() => go('SET-BOOT-V04')}>继续</SetupButton>
      </div>
    );
  }

  if (state === 'SET-BOOT-V03') {
    return (
      <div className="setup-screen setup-offline-screen">
        <SetupHeader eyebrow="跳过设置" title="不连接 Wi-Fi 并继续？" onBack={() => go('SET-APP-V01')} />
        <main>
          <section><strong>离线可用</strong><span><Check size={28} />手动烹饪</span><span><Check size={28} />本机内置菜谱</span></section>
          <section className="is-unavailable"><strong>需要 Wi-Fi</strong><span><CircleAlert size={28} />AI 烹饪和 AI 推荐</span><span><CircleAlert size={28} />App 通知和远程操作</span></section>
        </main>
        <SetupFooter primary="离线继续" onPrimary={() => go('SET-BOOT-V04')} secondary="返回设置" onSecondary={() => go('SET-APP-V01')} />
      </div>
    );
  }

  return (
    <div className="setup-screen setup-ready-screen">
      <main><div className="setup-result-icon is-success"><Check size={72} /></div><h1>设置完成</h1><p>您可以稍后通过 Typhur App 完成配网或管理设备。</p></main>
      <SetupButton onClick={finish}>进入主页</SetupButton>
    </div>
  );
}
