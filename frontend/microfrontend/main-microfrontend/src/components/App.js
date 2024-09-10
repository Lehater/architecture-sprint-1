import React, { lazy, Suspense, useState, useEffect } from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

// Auth
// import Register from "./Register";
// import Login from "./Login";
// import InfoTooltip from "./InfoTooltip";
// import ProtectedRoute from "./ProtectedRoute";
// import * as auth from "../utils/auth.js";
// import authApi from "../utils/api";

// Profile
// import EditProfilePopup from "./EditProfilePopup";
// import EditAvatarPopup from "./EditAvatarPopup";


// Galary
// import Main from "./Main";
// import ImagePopup from "./ImagePopup";
// import AddPlacePopup from "./AddPlacePopup";
// import galaryApi from "../utils/api";

import api from "../utils/api";

//////////////////
// Динамическая загрузка компонентов
const AuthApp = React.lazy(() => import('auth/AuthApp'));
const ProfileApp = React.lazy(() => import('profile/ProfileApp'));
const GalleryApp = React.lazy(() => import('gallery/GalleryApp'));


const Main = lazy(() =>
  import("gallery/Main").catch(() => {
    return {
      default: () => (
        <div className="error">Main Component is not available!</div>
      ),
    };
  })
);

const ImagePopup = lazy(() =>
  import("gallery/ImagePopup").catch(() => {
    return {
      default: () => (
        <div className="error">ImagePopup Component is not available!</div>
      ),
    };
  })
);

const AddPlacePopup = lazy(() =>
  import("gallery/AddPlacePopup").catch(() => {
    return {
      default: () => (
        <div className="error">AddPlacePopup Component is not available!</div>
      ),
    };
  })
);

const galaryApi = lazy(() =>
  import("gallery/galaryApi").catch(() => {
    return {
      default: () => <div className="error">Gallery API is not available!</div>,
    };
  })
);

const EditProfilePopup = lazy(() =>
  import("main/EditProfilePopup").catch(() => {
    return {
      default: () => (
        <div className="error">
          EditProfilePopup Component is not available!
        </div>
      ),
    };
  })
);

const EditAvatarPopup = lazy(() =>
  import("main/EditAvatarPopup").catch(() => {
    return {
      default: () => (
        <div className="error">EditAvatarPopup Component is not available!</div>
      ),
    };
  })
);

const Register = lazy(() =>
  import("main/Register").catch(() => {
    return {
      default: () => (
        <div className="error">Register Component is not available!</div>
      ),
    };
  })
);

const Login = lazy(() =>
  import("main/Login").catch(() => {
    return {
      default: () => (
        <div className="error">Login Component is not available!</div>
      ),
    };
  })
);

const InfoTooltip = lazy(() =>
  import("main/InfoTooltip").catch(() => {
    return {
      default: () => (
        <div className="error">InfoTooltip Component is not available!</div>
      ),
    };
  })
);

const ProtectedRoute = lazy(() =>
  import("main/ProtectedRoute").catch(() => {
    return {
      default: () => (
        <div className="error">ProtectedRoute Component is not available!</div>
      ),
    };
  })
);

const auth = lazy(() =>
  import("main/auth").catch(() => {
    return {
      default: () => <div className="error">Auth Module is not available!</div>,
    };
  })
);

const authApi = lazy(() =>
  import("main/authApi").catch(() => {
    return {
      default: () => {
        return {
          default: () => (
            <div className="error">Auth API is not available!</div>
          ),
        };
      },
    };
  })
);

const CurrentUserContext = lazy(() =>
  import("main/CurrentUserContext").catch(() => {
    return {
      default: () => (
        <div className="error">CurrentUserContext is not available!</div>
      ),
    };
  })
);
/////////////////

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);

  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  //В компоненты добавлены новые стейт-переменные: email — в компонент App
  const [email, setEmail] = React.useState("");

  const history = useHistory();

  // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(userUpdate) {
    api
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatarUpdate) {
    api
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function onRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/signin");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        setIsLoggedIn(true);
        setEmail(email);
        history.push("/");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={isLoggedIn}
          />
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
          onClose={closeAllPopups}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
