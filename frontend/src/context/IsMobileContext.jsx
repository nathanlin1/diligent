import {createContext, useContext} from 'react';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';

const IsMobileContext = createContext();

export const IsMobileProvider = ({children}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <IsMobileContext.Provider value={isMobile}>
      {children}
    </IsMobileContext.Provider>
  );
};

IsMobileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useIsMobile = () => useContext(IsMobileContext);
