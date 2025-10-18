'use client';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '300px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
      }}
    >
      Loading map...
    </div>
  ),
});

export default DynamicMap;
