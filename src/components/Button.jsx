import styles from "./Button.module.css";
function Button({ children, onClick, type }) {
  //css模块里styles['xxx']和styles.xxx是一样的，就是变量一定要前者
  return (
    <button onClick={onClick} className={`${styles["btn"]} ${styles[type]}`}>
      {children}
    </button>
  );
}

export default Button;
