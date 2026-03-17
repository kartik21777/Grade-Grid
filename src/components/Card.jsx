import { Link } from 'react-router-dom';

const Card = ({styles, heading, text, linkTo}) => {
  return (
      <Link to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>
        <div className={styles}>
          <h3>{heading}</h3>
          <p>{text}</p>
        </div>
      </Link>
  );
};

export default Card;
