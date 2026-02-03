"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../config/redux/store";
import AuthRehydrator from "@/Components/AuthRehydrator/page";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthRehydrator>
            {children}
          </AuthRehydrator>
        </Provider>
      </body>
    </html>
  );
}
