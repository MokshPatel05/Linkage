//This is the Index "/" route file.
"use client";

import { useRouter } from "next/navigation";
import style from "./home.module.css";
import UserLayout from "@/layout/UserLayout/page";

export default function Home() {

  const router = useRouter();

  const isLoggedIn = () => {
    if (localStorage.getItem("token") != null) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }
  return (
    <UserLayout>
      <div className={style.container}>
        <div className={style.mainContainer}>
          <div className={style.mainContainer__left}>
            <p>Linkage: Connect with your friends <br /> without any exaggeration.</p>
            <p>True Social Media Platform, With Stories no blufs !!!</p>

            <div
              onClick={() => isLoggedIn()}
              className={style.buttonJoin}>
              <p>Join Now</p>
            </div>
          </div>
          <div className={style.mainContainer__right}>
            <img src="/images/homepage_connection.png" alt="Connection_image" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
