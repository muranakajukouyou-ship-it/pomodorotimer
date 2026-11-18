import React, { useState, useEffect } from 'react';
import './App.css';

const COLLECTION_ITEMS = [
  { id: 1, name: '小さな芽', emoji: '🌱', desc: 'すくすく育つ最初の一歩' },
  { id: 2, name: 'あったかマグカップ', emoji: '☕', desc: 'お気に入りの温かい飲み物' },
  { id: 3, name: 'お昼寝グマ', emoji: '🧸', desc: 'のんびり見守ってくれる相棒' },
  { id: 4, name: 'きらめく星', emoji: '⭐', desc: '集中が冴えわたる証' },
  { id: 5, name: 'ふしぎなキノコ', emoji: '🍄', desc: '森の奥で見つけた宝物' },
  { id: 6, name: '小さな本', emoji: '📖', desc: '知識が深まるお気に入りの一冊' },
];

export default function App() {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [myCollection, setMyCollection] = useState<number[]>([]);

  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedCount((prev) => prev + 1);
        if (myCollection.length < COLLECTION_ITEMS.length) {
          const nextId = myCollection.length + 1;
          setMyCollection([...myCollection, nextId]);
        }
        alert('お疲れ様でした！新しいコレクションが部屋に届きました 🎉');
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        alert('休憩終了！次の集中セッションを始めましょう 💪');
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, myCollection]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

 

  return (
    <div style={styles.container}>
      {/* 画面幅によってスタイルを切り替えるためのインラインメディアクエリ風クラス */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-layout {
            flex-direction: column !important;
            align-items: center !important;
          }
          .responsive-card {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <header style={styles.header}>
        <h1 style={styles.title}>🌿 Cozy Focus Room</h1>
        <p style={styles.subtitle}>集中して、自分だけのお部屋にアイテムを集めよう</p>
      </header>

      {/* クラス名に .responsive-layout を付与 */}
      <div className="responsive-layout" style={styles.mainLayout}>
        {/* 左側：タイマーエリア */}
        <section className="responsive-card" style={styles.timerCard}>
          <div style={styles.modeBadge}>
            {mode === 'work' ? '🔥 集中タイム (Work)' : '☕ 休憩タイム (Break)'}
          </div>
          
          <div style={styles.timerDisplay}>
            {formatTime(timeLeft)}
          </div>

          <div style={styles.buttonGroup}>
            <button 
              onClick={toggleTimer} 
              style={{ ...styles.button, backgroundColor: isRunning ? '#e06d6d' : '#6d9be0' }}
            >
              {isRunning ? '一時停止' : 'スタート'}
            </button>
            <button onClick={resetTimer} style={styles.subButton}>リセット</button>
          </div>

         
        </section>

        {/* 右側：コレクションエリア */}
        <section className="responsive-card" style={styles.roomCard}>
          <h2 style={styles.roomTitle}>
            🎁 マイ・コレクション ({myCollection.length} / {COLLECTION_ITEMS.length})
          </h2>
          <p style={styles.roomDesc}>集中を完了するたびに、新しいアイテムがここに飾られます。</p>

          <div style={styles.grid}>
            {COLLECTION_ITEMS.map((item) => {
              const isUnlocked = myCollection.includes(item.id);
              return (
                <div 
                  key={item.id} 
                  style={{
                    ...styles.itemBox,
                    opacity: isUnlocked ? 1 : 0.3,
                    borderColor: isUnlocked ? '#d4af37' : '#3f3f4e',
                    backgroundColor: isUnlocked ? '#2d2d3a' : '#22222b',
                  }}
                >
                  <span style={styles.itemEmoji}>{isUnlocked ? item.emoji : '🔒'}</span>
                  <div style={{ ...styles.itemName, color: isUnlocked ? '#f1f5f9' : '#64748b' }}>
                    {isUnlocked ? item.name : '？？？'}
                  </div>
                  <div style={styles.itemDesc}>{isUnlocked ? item.desc : '集中して解除'}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1e1e24',
    color: '#f5f5f7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '30px 16px',
    boxSizing: 'border-box' as const,
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#e2e8f0',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#94a3b8',
  },
  mainLayout: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '24px',
    justifyContent: 'center',
    maxWidth: '960px',
    margin: '0 auto',
  },
  timerCard: {
    backgroundColor: '#2a2a35',
    borderRadius: '16px',
    padding: '24px',
    width: '320px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    border: '1px solid #3f3f4e',
    boxSizing: 'border-box' as const,
  },
  modeBadge: {
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
    backgroundColor: '#3f3f4e',
    color: '#cbd5e1',
    marginBottom: '16px',
  },
  timerDisplay: {
    fontSize: '3.2rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: '16px 0',
    fontFamily: 'monospace',
    color: '#ffffff',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    marginTop: '10px',
  },
  button: {
    flex: 2,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  subButton: {
    flex: 1,
    padding: '12px',
    border: '1px solid #4a4a5e',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#cbd5e1',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  
  roomCard: {
    backgroundColor: '#2a2a35',
    borderRadius: '16px',
    padding: '24px',
    flex: 1,
    maxWidth: '520px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    border: '1px solid #3f3f4e',
    boxSizing: 'border-box' as const,
  },
  roomTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#f1f5f9',
  },
  roomDesc: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
  },
  itemBox: {
    borderRadius: '10px',
    padding: '12px',
    textAlign: 'center' as const,
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '90px',
    transition: 'all 0.3s ease',
  },
  itemEmoji: {
    fontSize: '1.8rem',
    marginBottom: '4px',
  },
  itemName: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '2px',
  },
  itemDesc: {
    fontSize: '0.65rem',
    color: '#94a3b8',
  },
};