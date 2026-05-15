import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <span className={`fi fi-${country.emoji?.toLowerCase()}`} />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
