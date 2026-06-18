import DistrictTemplate from './DistrictTemplate';

const Chennai = () => (
  <DistrictTemplate
    name="Chennai"
    avatarTitle="CG"
    avatarName="Chennai Guardian"
    status="Critical"
    level="Emergency"
    activeRequests={12}
    availableDonors={142}
    theme="red"
  />
);

export default Chennai;
