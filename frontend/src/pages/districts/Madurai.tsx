import DistrictTemplate from './DistrictTemplate';

const Madurai = () => (
  <DistrictTemplate
    name="Madurai"
    avatarTitle="MR"
    avatarName="Madurai Responder"
    status="High"
    level="Elevated"
    activeRequests={6}
    availableDonors={110}
    theme="red"
  />
);

export default Madurai;
