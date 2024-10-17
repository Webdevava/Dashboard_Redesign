import AlertsSlider from '@/components/cards/AlertsSlider'
import APMStatistics from '@/components/charts/APMStatistics'
import dynamic from 'next/dynamic';
const APMLocations = dynamic(() => import("@/components/maps/APMLocations"), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Render the component on the client-side only
});
import React from 'react'

const page = () => {
  return (
    < >
      <div className=" h-[110vh] lg:h-[55vh] flex flex-col lg:flex-row gap-6">
        <APMStatistics />
        <APMLocations />
      </div>
      <AlertsSlider />
    </>
  );
}

export default page
