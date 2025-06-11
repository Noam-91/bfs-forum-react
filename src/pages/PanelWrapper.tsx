import { useSelector } from 'react-redux';
import type{ RootState } from '../redux/store';
import AdminPanel from './AdminPanel';
// import UserPanel from './UserPanel';

const PanelWrapper = () => {
//   const role = useSelector((state: RootState) => state.user.role);
  const role = 'admin';
  // if (!role) {
  //   return <div>Loading...</div>;
  // }
  
  return <AdminPanel/>;
};

export default PanelWrapper;
