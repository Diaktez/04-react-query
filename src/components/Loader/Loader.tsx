import css from "./Loader.module.css";

export default function Loader() {
  return (
    <>
      <div className={css.loaderOverlay}>
        <p className={css.text}>Loading movies, please wait...</p>
      </div>
    </>
  );
}
