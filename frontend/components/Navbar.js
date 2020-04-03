import Link from 'next/link';

const styles = {
  nav: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 60,
    justifyContent: 'flex-end'
  },
  li: {
    minWidth: 120,
    textAlign: 'center',
    alignSelf: 'center'
  },
  a: {
    textDecoration: 'none'
  },
  ul: {
    listStyle: 'none',
    display: 'flex'
  }
};

const Navbar = () => (
  <div style={styles.nav}>
    <ul style={styles.ul}>
      <li style={styles.li}>
        <Link href="/">
          <a style={styles.a}>Home</a>
        </Link>
      </li>
      <li style={styles.li}>
        <Link href="/about">
          <a style={styles.a}>About</a>
        </Link>
      </li>
      <li style={styles.li}>
        <Link href="/about">
          <a style={styles.a}>Privacy Policy</a>
        </Link>
      </li>
      <li style={styles.li}>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=abhinavdc&repo=findmeajob&type=star&count=true"
          frameborder="0"
          scrolling="0"
          width="120px"
          height="20px"
        ></iframe>
      </li>
    </ul>
  </div>
);

export default Navbar;
