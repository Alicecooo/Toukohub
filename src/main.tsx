import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { clearSave, loadSave, saveGame, type Save } from './storage';
import { loadStory } from './story';
import type { Story } from './types';
import { applyEffects, isChoiceAvailable } from './conditions';

function App() {
  const [story, setStory] = useState<Story | null>(null); const [error, setError] = useState(''); const [save, setSave] = useState<Save | null>(null);
  useEffect(() => { loadStory().then(s => { setStory(s); setSave(loadSave(s)); }).catch(e => setError(e instanceof Error ? e.message : '剧情加载失败')); }, []);
  const node = useMemo(() => story?.nodes.find(n => n.id === (save?.nodeId ?? story.startNode)) ?? story?.nodes.find(n => n.id === story.startNode), [story, save]);
  if (error) return <main className="shell"><h1>雨夜回声</h1><p role="alert">{error}</p></main>;
  if (!story || !node) return <main className="shell"><p>正在读取剧情…</p></main>;
  const current: Save = save ?? { storyVersion: story.version, nodeId: story.startNode, flags: {} };
  const advance = (next: string, effects = {}) => { const nextSave = { ...current, nodeId: next, flags: applyEffects(current.flags, effects) }; setSave(nextSave); saveGame(nextSave); };
  const restart = () => { clearSave(); setSave({ storyVersion: story.version, nodeId: story.startNode, flags: {} }); };
  return <main className="shell" style={{ backgroundImage: node.background ? `url(${node.background})` : undefined }}><header><span>雨夜回声</span><small>v{story.version}</small><button onClick={restart} aria-label="重新开始">↺</button></header><section className="scene"><div className="portrait" aria-hidden="true">{node.speaker ? (story.characters[node.speaker] ?? node.speaker[0]) : '◇'}</div><div className="dialogue">{node.speaker && <h2>{story.characters[node.speaker] ?? node.speaker}</h2>}<p>{node.text}</p>{node.ending ? <div className="ending"><strong>{node.ending.title}</strong>{node.ending.text && <p>{node.ending.text}</p>}<button onClick={restart}>再读一遍</button></div> : <div className="choices">{node.choices?.filter(choice => isChoiceAvailable(choice, current.flags)).map(choice => <button key={choice.text} onClick={() => advance(choice.next, choice.effects)}>{choice.text}</button>)}</div>}</div></section><footer><button onClick={() => saveGame(current)}>保存</button><button onClick={() => { const loaded = loadSave(story); if (loaded) setSave(loaded); }}>读取存档</button><span>存档版本 {current.storyVersion}</span></footer></main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
