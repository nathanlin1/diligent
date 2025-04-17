/*
#######################################################################
#
# Copyright (C) 2020-2025 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {IsMobileProvider} from './context/IsMobileContext';
import {WorkspaceProvider} from './context/WorkspaceContext';
import {ChannelsProvider} from './context/ChannelsContext';
import {MessagesProvider} from './context/MessagesContext';
import Channel from './routes/Channel';
import Login from './routes/Login';
import Home from './routes/Home';
import ProtectedRoute from './routes/ProtectedRoute';

/**
 * Simple component with no state.
 * @returns {object} JSX
 */
function App() {
  return (
    <AuthProvider>
      <IsMobileProvider>
        <WorkspaceProvider>
          <ChannelsProvider>
            <MessagesProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route
                    path="/workspace/:workspaceName"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                /> */}
                  <Route
                    path="/workspace/:workspaceName/channel/:channelName"
                    element={
                      <ProtectedRoute>
                        <Channel />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </MessagesProvider>
          </ChannelsProvider>
        </WorkspaceProvider>
      </IsMobileProvider>
    </AuthProvider>
  );
}

export default App;
