import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CinematicVideoPlayer } from './CinematicVideoPlayer';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl"
        >
          <CinematicVideoPlayer onClose={onClose} isModal={true} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
