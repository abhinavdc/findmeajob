import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  input: {
    width: '80%',
    height: 35,
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 'thin'
  },
  button: {},
  subscribeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    padding: '0 40px',
    height: 100
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 150,
    padding: 20
  },
  footer: {
    height: 400
  }
});
export default function Subscribe() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <h1>findmeajob.in</h1>
        <span>
          A weekly roundup of the hotest IT job openings from all tech parks of
          kerala
        </span>
      </div>
      <div className={classes.subscribeContainer}>
        <input className={classes.input} />
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
        >
          Subscribe
        </Button>
      </div>
      <div className={classes.footer}>
        <span>Join 822 other subscribers today</span>
      </div>
    </div>
  );
}
