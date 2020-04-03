import {
  TextField,
  Box,
  Button,
  FormControl,
  makeStyles
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0px',
    minHeight: 80,
    padding: 10
  },
  asd: {
    display: 'flex',
    alignItems: 'center',
    'flex-flow': 'row wrap',
    justifyContent: 'center'
  },
  form: {
    display: 'flex',
    'flex-flow': 'row wrap',
    justifyContent: 'center'
  },
  textField: {
    margin: 5,
    width: 'inherit'
  },
  button: {
    padding: 10
  }
});
export default function Subscribe() {
  const classes = useStyles();
  return (
    <Box component={Paper} m={1} className={classes.container}>
      <div className={classes.asd}>
        <FormControl className={classes.form}>
          <TextField
            // variant="outlined"
            className={classes.textField}
            id="job"
            label="Job Keywords"
            type="search"
          />
          <TextField
            // variant="outlined"
            className={classes.textField}
            id="job"
            label="Company"
            type="search"
          />
          <TextField
            // variant="outlined"
            className={classes.textField}
            id="job"
            label="Location"
            type="search"
          />
        </FormControl>
        <div className={classes.button}>
          <Button variant="contained" color="primary">
            Search
          </Button>
        </div>
      </div>
    </Box>
  );
}
