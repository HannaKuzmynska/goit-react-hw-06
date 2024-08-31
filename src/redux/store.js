import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import contactsReducer from './contactsSlice';
import filtersReducer from './filtersSlice';

// Конфігурація для збереження контактів
const persistConfig = {
  key: 'contacts',
  storage,
};

// Застосування конфігурації до редюсера контактів
const persistedContactsReducer = persistReducer(persistConfig, contactsReducer);

export const store = configureStore({
  reducer: {
    contacts: persistedContactsReducer, // Використання persistedContactsReducer тут
    filters: filtersReducer,
  },
  // Додайте цей рядок, якщо ваш проект використовує перевірку серіалізації
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Вимкнути перевірку на серіалізацію
    }),
});

export const persistor = persistStore(store);



