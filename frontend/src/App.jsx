import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import Inicio from './views/Inicio';
import RecetaDetail from './views/RecetaDetail';
import NotFound from './views/NotFound';
import Users from './views/Users';
import UserNew from './views/UserNew';
import UserUpdate from './views/UserUpdate';
import LogIn from './views/LogIn';
import Register from './views/Register';
import Recetas from './views/Recetas';
import RecetaNew from './views/RecetaNew';
import RecetaUpdate from './views/RecetaUpdate';
import Ingredientes from './views/Ingredientes';
import IngredienteUpdate from './views/IngredienteUpdate';
import IngredienteNew from './views/IngredienteNew';

import Nav from './components/Nav';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <header>
          <p>Recetario Argentino</p>
          <Nav />
        </header>
        <main>
          <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path='/recetas/:id' element={<RecetaDetail />} />
            <Route path='/users' element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } />
            <Route path='/usernew' element={
              <PrivateRoute>
                <UserNew />
              </PrivateRoute>
            } />
            <Route path='/userupdate/:id' element={
              <PrivateRoute>
                <UserUpdate />
              </PrivateRoute>
            } />
            <Route path='/recetas' element={
              <PrivateRoute>
                <Recetas />
              </PrivateRoute>
            } />
            <Route path='/recetanew' element={
              <PrivateRoute>
                <RecetaNew />
              </PrivateRoute>
            } />
            <Route path='/recetaupdate/:id' element={
              <PrivateRoute>
                <RecetaUpdate />
              </PrivateRoute>
            } />
            <Route path='/ingredientes' element={
              <PrivateRoute>
                <Ingredientes />
              </PrivateRoute>
            } />
            <Route path='/ingredienteupdate/:id' element={
              <PrivateRoute>
                <IngredienteUpdate />
              </PrivateRoute>
            } />
            <Route path='/ingredientenew' element={
              <PrivateRoute>
                <IngredienteNew />
              </PrivateRoute>
            } />
            <Route path='/login' element={<LogIn />} />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
        <footer>Lara Crupnicoff - Parcial 2 - Aplicaciones Híbridas</footer>
      </div>
    </AuthProvider>
  )
}

export default App;