import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Film, 
  X,
  CheckCircle2,
  Headphones,
  Music,
  Mic,
  MicOff
} from 'lucide-react';
import { soundEngine } from '../../audio/soundEffects';
import { Scene1EpistemicFailure } from './scenes/Scene1EpistemicFailure';
import { Scene2SubstrateArchitecture } from './scenes/Scene2SubstrateArchitecture';
import { Scene3ContradictionEngine } from './scenes/Scene3ContradictionEngine';
import { Scene4BenchmarkProof } from './scenes/Scene4BenchmarkProof';
import { Scene5EndCard } from './scenes/Scene5EndCard';

interface CinematicVideoPlayerProps {
  onClose?: () => void;
  isModal?: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  act: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
}

export const CHAPTERS: Chapter[] = [
  { id: 1, act: 'Act I', title: 'Epistemic Failure of LLMs', startTime: 0, endTime: 35 },
  { id: 2, act: 'Act II', title: 'Cranium Substrate™ Layer', startTime: 35, endTime: 65 },
  { id: 3, act: 'Act III', title: 'Contradiction Engine Live Demo', startTime: 65, endTime: 115 },
  { id: 4, act: 'Act IV', title: 'Empirical Benchmark Proof', startTime: 115, endTime: 145 },
  { id: 5, act: 'Act V', title: 'End Card & Technical Due Diligence', startTime: 145, endTime: 155 }
];

const TOTAL_DURATION = 155; // 2 minutes 35 seconds

export function CinematicVideoPlayer({ onClose, isModal = false }: CinematicVideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);
  const [isNarrationMuted, setIsNarrationMuted] = useState<boolean>(false);
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showChapterMenu, setShowChapterMenu] = useState<boolean>(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const lastActRef = useRef<number>(0);

  // Function to unlock Web Audio + Web Speech API on user gesture
  const handleEnableAudio = async () => {
    const success = await soundEngine.unlockAudio();
    if (success) {
      setAudioUnlocked(true);
      setIsMuted(false);
      soundEngine.setMuted(false);
      // Trigger voiceover for active chapter
      if (!isNarrationMuted) {
        soundEngine.speakAct(currentChapter.id);
      }
    }
  };

  // Determine current chapter
  const currentChapter = CHAPTERS.find(
    (c) => currentTime >= c.startTime && currentTime < c.endTime
  ) || CHAPTERS[CHAPTERS.length - 1];

  // Calculate local progress for active scene (0 to 1)
  const sceneProgress = Math.min(
    1,
    Math.max(
      0,
      (currentTime - currentChapter.startTime) /
        (currentChapter.endTime - currentChapter.startTime)
    )
  );

  // Speak narration and trigger scene transition SFX on act change
  useEffect(() => {
    if (isPlaying && !isMuted) {
      if (lastActRef.current !== currentChapter.id) {
        lastActRef.current = currentChapter.id;
        soundEngine.playActTransition();
        if (!isNarrationMuted) {
          soundEngine.speakAct(currentChapter.id);
        }
      }
    }
  }, [currentChapter.id, isPlaying, isMuted, isNarrationMuted]);

  // Main playback timer
  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTimestamp) / 1000;
        lastTimestamp = now;

        setCurrentTime((prev) => {
          const next = prev + delta * playbackRate;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });
      } else {
        lastTimestamp = now;
      }
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, playbackRate]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    soundEngine.resetSpokenAct();
  };

  const jumpToChapter = (chapter: Chapter) => {
    soundEngine.resetSpokenAct();
    setCurrentTime(chapter.startTime);
    setIsPlaying(true);
    setShowChapterMenu(false);
    if (audioUnlocked && !isMuted && !isNarrationMuted) {
      soundEngine.speakAct(chapter.id);
    }
  };

  const togglePlay = async () => {
    if (!audioUnlocked) {
      await handleEnableAudio();
    }
    if (!isPlaying) {
      if (!isMusicMuted) soundEngine.startAmbient();
      if (!isNarrationMuted) soundEngine.speakAct(currentChapter.id);
    } else {
      soundEngine.stopAmbient();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = async () => {
    if (!audioUnlocked) {
      await handleEnableAudio();
      return;
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      if (!isMusicMuted) soundEngine.startAmbient();
      if (!isNarrationMuted) soundEngine.speakAct(currentChapter.id);
    }
  };

  const toggleNarration = () => {
    const next = !isNarrationMuted;
    setIsNarrationMuted(next);
    soundEngine.setNarrationMuted(next);
    if (!next && audioUnlocked && isPlaying && !isMuted) {
      soundEngine.speakAct(currentChapter.id);
    }
  };

  const toggleMusic = () => {
    const next = !isMusicMuted;
    setIsMusicMuted(next);
    soundEngine.setMusicMuted(next);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={playerContainerRef}
      className={`relative w-full bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col ${
        isFullscreen ? 'h-screen' : isModal ? 'h-[85vh] max-h-[820px]' : 'aspect-video min-h-[520px]'
      }`}
    >
      {/* Video Content Stage */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-neutral-950">
        {currentChapter.id === 1 && <Scene1EpistemicFailure progress={sceneProgress} />}
        {currentChapter.id === 2 && <Scene2SubstrateArchitecture progress={sceneProgress} />}
        {currentChapter.id === 3 && <Scene3ContradictionEngine progress={sceneProgress} />}
        {currentChapter.id === 4 && <Scene4BenchmarkProof progress={sceneProgress} />}
        {currentChapter.id === 5 && (
          <Scene5EndCard 
            progress={sceneProgress} 
            onReplay={() => {
              soundEngine.resetSpokenAct();
              setCurrentTime(0);
              setIsPlaying(true);
              soundEngine.speakAct(1);
            }}
            onClose={onClose}
          />
        )}

        {/* Prominent Audio Unlock Banner if browser blocked autoplay audio */}
        {!audioUnlocked && (
          <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
            <button
              onClick={handleEnableAudio}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans font-medium shadow-xl shadow-indigo-600/30 border border-indigo-400/40 animate-pulse transition-all cursor-pointer"
            >
              <Headphones size={15} />
              <span>Click to Enable Audio & Voiceover Narration</span>
            </button>
          </div>
        )}

        {/* Modal Close Button Top-Right if applicable */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 backdrop-blur transition-all cursor-pointer"
            title="Close Video"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Control Bar Overlay */}
      <div className="relative z-40 bg-neutral-950/95 border-t border-neutral-800/80 px-4 sm:px-6 py-3 backdrop-blur select-none">
        {/* Timeline Scrubber */}
        <div className="relative mb-2.5 flex items-center group">
          {/* Chapter segments background on track */}
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-neutral-800 flex overflow-hidden">
            {CHAPTERS.map((ch) => {
              const widthPct = ((ch.endTime - ch.startTime) / TOTAL_DURATION) * 100;
              return (
                <div
                  key={ch.id}
                  style={{ width: `${widthPct}%` }}
                  className="h-full border-r border-neutral-900/80 hover:bg-neutral-700 transition-colors"
                />
              );
            })}
          </div>

          {/* Active progress bar */}
          <div
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            className="absolute left-0 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-400 pointer-events-none"
          />

          {/* Range input slider */}
          <input
            type="range"
            min="0"
            max={TOTAL_DURATION}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="relative z-10 w-full h-1.5 opacity-0 cursor-pointer"
          />
        </div>

        {/* Action Controls & Metadata Row */}
        <div className="flex items-center justify-between gap-4 text-neutral-300 text-xs font-sans">
          {/* Left: Play/Pause, Replay, Timecode, Chapter Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={() => {
                soundEngine.resetSpokenAct();
                setCurrentTime(0);
                setIsPlaying(true);
                if (audioUnlocked && !isMuted) {
                  soundEngine.speakAct(1);
                }
              }}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Restart Demo"
            >
              <RotateCcw size={14} />
            </button>

            <div className="font-mono text-neutral-400 text-xs">
              <span className="text-neutral-200">{formatTime(currentTime)}</span> / {formatTime(TOTAL_DURATION)}
            </div>

            {/* Current Chapter Badge / Selector */}
            <div className="relative">
              <button
                onClick={() => setShowChapterMenu(!showChapterMenu)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 font-mono cursor-pointer"
              >
                <Film size={12} className="text-indigo-400" />
                <span className="text-indigo-300">{currentChapter.act}:</span>
                <span className="truncate max-w-[140px] md:max-w-[200px]">{currentChapter.title}</span>
              </button>

              {/* Chapter popover menu */}
              {showChapterMenu && (
                <div className="absolute bottom-10 left-0 w-64 bg-neutral-900 border border-neutral-700 rounded-xl p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                    Jump to Act
                  </div>
                  {CHAPTERS.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => jumpToChapter(ch)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                        currentChapter.id === ch.id
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'hover:bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] opacity-75">{ch.act}</span>
                        <span className="truncate">{ch.title}</span>
                      </div>
                      <span className="font-mono text-[10px] opacity-75">{formatTime(ch.startTime)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Narration toggle, Music toggle, Playback Speed, Mute, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Voice Narration toggle */}
            <button
              onClick={toggleNarration}
              className={`px-2 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                !isNarrationMuted && audioUnlocked
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
              title={isNarrationMuted ? 'Turn Narration Voice ON' : 'Turn Narration Voice OFF'}
            >
              {!isNarrationMuted && audioUnlocked ? <Mic size={13} className="text-indigo-400" /> : <MicOff size={13} />}
              <span className="hidden lg:inline text-[11px]">Voice</span>
            </button>

            {/* Ambient Synth Music toggle */}
            <button
              onClick={toggleMusic}
              className={`px-2 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                !isMusicMuted && audioUnlocked
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
              title={isMusicMuted ? 'Turn Ambient Music ON' : 'Turn Ambient Music OFF'}
            >
              <Music size={13} className={!isMusicMuted && audioUnlocked ? 'text-indigo-400' : ''} />
              <span className="hidden lg:inline text-[11px]">Synth</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
              {[1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    playbackRate === rate
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Master Sound toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer ${
                isMuted || !audioUnlocked ? 'text-neutral-500' : 'text-indigo-400'
              }`}
              title={isMuted ? 'Unmute All Audio' : 'Mute All Audio'}
            >
              {isMuted || !audioUnlocked ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
