//This is the Index "/" route file.
"use client";

import { useRouter } from "next/navigation";
import style from "./home.module.css";

export default function Home() {

  const router = useRouter();
  return (
    <>
      <div className={style.container}>
        <div className={style.mainContainer}>
          <div className={style.mainContainer__left}>
            <p>Linkage is a platform that allows you to connect with your friends without any exaggeration.</p>
            <p>True Social Media Platform, With Stories no blufs !!!</p>
          
          <div 
          onClick={() => router.push("/login")}
          className={style.buttonJoin}>
            <p>Join Now</p>
          </div>
          </div>
          <div className={style.mainContainer__right}>
            <img src="/images/homepage_connection.png" alt="Connection_image" />
          </div>
        </div>
      </div>
    </>
  );
}
