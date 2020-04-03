import {
  TextField,
  Box,
  Button,
  FormControl,
  makeStyles,
  InputLabel,
  Select,
  MenuItem
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
  },
  formControl: {}
});
export default function Search() {
  const classes = useStyles();
  const age = 10;

  const handleChange = event => {};

  const search = () => {};

  return (
    <Box component={Paper} m={1} className={classes.container}>
      <FormControl>
        <TextField
          className={classes.textField}
          id="job"
          label="Job Keywords"
          type="search"
        />
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value={10}>Trivandrum</MenuItem>
          <MenuItem value={20}>Kochi</MenuItem>
          <MenuItem value={30}>Calicut</MenuItem>
        </Select>
      </FormControl>
      <div className={classes.button}>
        <Button variant="contained" onClick={search} color="primary">
          Search
        </Button>
      </div>
    </Box>
  );
}
