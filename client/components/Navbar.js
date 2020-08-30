import GitHubButton from 'react-github-button';

const styles = {
  nav: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 60,
    justifyContent: 'flex-end',
    position: 'absolute',
  },
  li: {
    minWidth: 120,
    textAlign: 'center',
    alignSelf: 'center',
  },
  a: {
    textDecoration: 'none',
  },
  ul: {
    listStyle: 'none',
    display: 'flex',
  },
};

const Navbar = () => (
  <div style={styles.nav}>
    <ul style={styles.ul}>
      <li style={styles.li}>
        <GitHubButton
          type="stargazers"
          namespace="abhinavdc"
          repo="trivia-app"
        />
      </li>
    </ul>
  </div>
);

export default Navbar;
