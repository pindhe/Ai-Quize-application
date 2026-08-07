import React, { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export const SplineScene = ({ scene, className }: SplineSceneProps) => {
  return (
    <div className={className}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white opacity-20 uppercase tracking-widest text-xs">Loading Pindhe AI...</div>}>
        <Spline scene={scene} />
      </Suspense>
    </div>
  );
};
