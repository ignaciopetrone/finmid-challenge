import { LOADING_TYPES, useAppState } from '../../../utils/appState';
import getAssetUrl from '../../../utils/getAssetUrl';
import Button from '../../atoms/button';
import './styles.scss';

const Navbar = () => {
  const { user, resolvers, isLoading, setLoading } = useAppState();

  const onLogout = async () => {
    setLoading(LOADING_TYPES.authLogout);
    try {
      await resolvers.logout();
    } catch (error: any) {
      console.error('Error during logout - ', error.message);
    } finally {
      setLoading(LOADING_TYPES.off);
    }
  };

  return (
    <div className="navbar">
      <img className="navbar__logo" src={getAssetUrl('vite.svg')} alt="logo" />
      {user && <p className="navbar__user-name">Welcome {user?.name}</p>}
      {user && (
        <Button
          isTertiary
          className="navbar__button"
          isLoading={isLoading === LOADING_TYPES.authLogout}
          onClick={onLogout}
        >
          Sign out
        </Button>
      )}
    </div>
  );
};
export default Navbar;
