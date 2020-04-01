import Link from 'next/link';

const styles = {
  ul: {
    display: 'flex',
    flexDirection: 'row',
    padding: '5px',
    width: '100%',
    height: '30px',
    backgroundColor: 'coral',
    justifyContent: 'space-around',
    listStyle: 'none'
  },
  li: {
    margin: 10
  },
  a: {
    textDecoration: 'none',
    color: 'white'
  }
};

const Navbar = () => (
  <ul style={styles.ul}>
    <li style={styles.li}>
      <Link href="/">
        <a style={styles.a}>Home</a>
      </Link>
    </li>
    <li style={styles.li}>
      <Link href="/about">
        <a style={styles.a}>Above</a>
      </Link>
    </li>
  </ul>
);

export default Navbar;
