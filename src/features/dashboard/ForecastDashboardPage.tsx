import { StageBanner } from '../../components/layout/StageBanner';
import { ForecastDashboard } from './ForecastDashboard';

export function ForecastDashboardPage(){
  return <div><StageBanner stage="dashboard" prerequisite="Complete model training to unlock validated results."/><ForecastDashboard/></div>;
}
