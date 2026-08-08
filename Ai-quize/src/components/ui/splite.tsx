import React, { Suspense, lazy } from 'react';
import { LoadingDots } from '../LoadingScreen';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export const SplineScene = ({ scene, className }: SplineSceneProps) => {
  return (
    <div className={className}>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <LoadingDots size="lg" className="opacity-90" />
          </div>
        }
      >
        <Spline scene={scene} />
      </Suspense>
    </div>
  );
};
